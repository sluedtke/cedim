#!/usr/bin/python
# show commands being executed, per debug
#
######################################################################

#       Filename: base_java.js

#       Author: Stefan Luedtke

#       Created: Tuesday 22 July 2014 22:56:23 CEST

#       Last modified: Friday 29 August 2014 09:39:04 CEST

######################################################################

#############################   	PURPOSE		######################
#
#   Get base layers from the database

###############A#######################################################
import json
import psycopg2
import psycopg2.extras
import cgi
import sys 
import cgitb; cgitb.enable()  # for troubleshooting

form=cgi.FieldStorage()

# Get data from fields
query=form['query'].value

######################################################################
try:
    conn = psycopg2.connect("dbname='cedim_rfra' user='guest'\
            host='139.17.99.27' password='guest'")
except:
    print "I am unable to connect to the database"

cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

###############A#######################################################
# German border
sql_border="SELECT gid, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom FROM germany;"

# catchments
sql_catchments="SELECT gid, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom FROM catchments;"

#gauge
sql_gauge="SELECT gid AS id, name, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom FROM pegel_tbas;" 
###############A#######################################################

if query=="border":
    cur.execute(sql_border)
elif query=="catch":
    cur.execute(sql_catchments)
elif query=="gauge":
    cur.execute(sql_gauge)
else:
    print "No query string given"

rows=cur.fetchall()

################A#######################################################
def create_featuresCollection(query):
    features=[]
    for query_row in query:
        geom=json.loads(query_row['geom'])
        col_list=query_row.keys()
        # get rid of the geom column
        col_list=[elem for elem in col_list if elem != "geom"]
        # init an empty dictionary to store the theme attributes /properties
        props={}
        for key in col_list:
            props[key]=query_row[key]

        feature={'type' : 'Feature',
                'geometry': geom,
                'properties': props,
                }
        features.append(feature)

    feat_coll={ 'type' : 'FeatureCollection',
        'features': 
            features
        }

    feat_coll=json.dumps(feat_coll)
    return(feat_coll)
################A#######################################################

geo_str=create_featuresCollection(rows)
print "Content-type: text/javascript\n\n";
print geo_str

