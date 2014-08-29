#!/usr/bin/python
######################################################################
#       Author: Kai Schroeter
#       Created: Tuesday 26 August 2014 
#       Last modified: Thursday 28 August 2014 16:10:40 CEST
#############################       PURPOSE        ######################
#
#    evaluate online gauge data with regard to return period
###############A#######################################################

import json
import psycopg2
import psycopg2.extras
import cgi
import sys, os
import cgitb; cgitb.enable()  # for troubleshooting
from datetime import date, timedelta

form=cgi.FieldStorage()


# Get data from fields
start=form['start_date'].value
end=form['end_date'].value

# adding the absolute path of this file to the python search path, so we can
# keep all the other files via symbolic links 
# sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__))))
# sys.path.append(os.path.join('/home/sluedtke/gfz/temp/kai/python_postgis/'))

# import postgres_connect

    # db_name = "cedim_rfra"
    # nutzer = "guest"
    # pwd = "guest"
    # host = "139.17.99.27"

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

#data base connection and creation of cursor    
db_name, user, pwd, host = settings_vm27_guest()
conn = connect(db_name, user, pwd, host)
cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

# constrain the evaluation period to three weeks before current date

# start = date.today() - timedelta(days=21)
# end = date.today() 
def classify_qmax(q, gauge):
    SQL = cur.mogrify("SELECT return_periods.tn_1_11, return_periods.tn_1_5,  return_periods.tn_2, return_periods.tn_5 FROM public.ccm2_rivers, public.tn_estimation, public.return_periods WHERE \
    CAST(ccm2_rivers.number AS BIGINT) = tn_estimation.fid_gauge AND tn_estimation.id_tn_method = return_periods.fid_tn_method AND \
    ccm2_rivers.number = %s AND tn_estimation.tn_baseperiod = %s AND tn_estimation.tn_method_code = %s ",(item, '3', '6'))
    cur.execute(SQL)
    rps = cur.fetchall()
    rps = rps[0]
    if q <= rps[0]:
        rp_class = 0
    elif q > rps[0] and q <= rps[1]:
        rp_class = 1
    elif q > rps[1] and q <= rps[2]:
        rp_class = 2
    elif q > rps[2] and q <= rps[3]:
        rp_class = 3
    elif q > rps[3] :
        rp_class = 4
    else:
        rp_class = 'NaN'
    return rp_class


def get_qmax(item,start, end):
    SQL= cur.mogrify("SELECT  MAX(ts_data_online.value) FROM public.ccm2_rivers, \
    public.ts_objects, public.ts_data_online WHERE CAST(ccm2_rivers.number AS \
    BIGINT) = ts_objects.fid_gauge AND ts_objects.id_time_series = \
    ts_data_online.fid_time_series AND ccm2_rivers.number = %s AND \
    ts_objects.variable = %s AND ts_data_online.time_stamp >= %s AND ts_data_online.time_stamp <= %s ", \
    (item, 'Q', start, end))

    cur.execute(SQL)
    qmax = cur.fetchall()
    qmax = qmax[0]
    qmax = qmax[0]
    return qmax

#select gauges to be processed
SQL = cur.mogrify("SELECT number FROM ccm2_rivers")
cur.execute(SQL)

gauges = cur.fetchall()
gauge_attributes=[]

#loop gauges to determine max_q in relevant period and classify according to rp
for item in gauges:
    item = item['number']
    qmax = get_qmax(item, start, end)

    if qmax:
        rp_class = classify_qmax(qmax, item)

        #store results in dictionary
        attr = {'number':item, 'qmax':qmax, 'rp_class':rp_class}
        gauge_attributes.append(attr)


sql_river="SELECT gid AS id, number, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS \
geom FROM ccm2_rivers;"

sql_gauge="SELECT gid AS id, name, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS \
geom FROM pegel_tbas;" 

# data="2"

# cur.execute(sql_poly, data)
# cur.execute(sql_gauge)
cur.execute(sql_river)
rows=cur.fetchall()

rows_new=[]
for row in rows:
    temp=dict(row)
    rows_new.append(temp)

# http://stackoverflow.com/questions/13975021/merge-join-lists-of-dictionaries-based-on-a-common-value-in-python
from collections import defaultdict
from itertools import chain

collector = defaultdict(dict)

for collectible in chain(gauge_attributes, rows_new):
    collector[collectible['number']].update(collectible.iteritems())

temp=list(collector.itervalues())

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

geo_str=create_featuresCollection(temp)
print "Content-type: text/javascript\n\n";
print geo_str


