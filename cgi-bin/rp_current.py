#!/usr/bin/python
######################################################################
#       Author: Kai Schroeter
#       Created: Tuesday 26 August 2014 
#       Last modified: Tuesday 02 September 2014 21:41:41 CEST
#############################       PURPOSE        ######################
#
#    evaluate online gauge data with regard to return period
###############A#######################################################

import json
import psycopg2
import psycopg2.extras
import cgi
import sys, os
from datetime import date, timedelta
import pdb
import string

import cgitb; cgitb.enable()  # for troubleshooting

form=cgi.FieldStorage()

# Get data from fields
start=form['start_date'].value
end=form['end_date'].value
rp_array=form['rp_array'].value
rp_array=json.loads(rp_array)


def connect(db_name, user, pwd, host):
    try:
        conn = psycopg2.connect(database=db_name, user=user, host = host, password=pwd)
    except (KeyError, TypeError), e:
        #print "database connection failed"
        print "Fehler:", e
    return conn

def settings_vm27_guest():
    db_name = "cedim_rfra"
    nutzer = "guest"
    pwd = "guest"
    host = "139.17.99.27"
    return db_name, nutzer, pwd, host

def read_sql(sql_fn):
    fn = open(sql_fn, 'r')
    sql = " ".join(fn.readlines())
    return(sql)

params=[start, end]
params=params+rp_array

def classify_qmax(target_list, params):

    SQL=read_sql('../sql_files/rp_current.sql')
    placeholder= '%s'
    placeholders= ', '.join(placeholder for unused in rp_array)
    SQL=string.replace(SQL, 'XXXX', placeholders)

    #data base connection and creation of cursor    
    db_name, user, pwd, host = settings_vm27_guest()
    conn = connect(db_name, user, pwd, host)
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    SQL=cur.mogrify(SQL, params)
    cur.execute(SQL)
    rps_all = cur.fetchall()

    for rps in rps_all:
        attr = {'number': rps['gauges'], 'qmax':rps['q_max'],
                'rp_class':rps['rp_class'],
                'geom': json.loads(rps['geom'])}
        target_list.append(attr)

    return target_list
################A#######################################################
def create_featuresCollection(query):
    features=[]
    for query_row in query:
        # geom=json.loads(query_row['geom'])
        geom=query_row['geom']
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

gauge_attributes=[]
temp=classify_qmax(gauge_attributes, params)

geo_str=create_featuresCollection(temp)
print "Content-type: text/javascript\n\n";
print geo_str

