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
import cgitb
from datetime import date, timedelta
import pdb

cgitb.enable()  # for troubleshooting
form=cgi.FieldStorage()


# # Get data from fields
start=form['start_date'].value
end=form['end_date'].value
#
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
# start = date.today() - timedelta(days=7)
# end = date.today() - timedelta(days=2)

SQL='WITH \
temp_gauges AS ( \
SELECT gid AS id, number AS gauge, ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom \
FROM  \
 ccm2_rivers\
), \
temp_max AS ( \
SELECT MAX(ts_data_online.value) AS q_max, ccm2_rivers.number AS gauges, temp_gauges.id, temp_gauges.geom \
FROM \
 public.ccm2_rivers, public.ts_objects, public.ts_data_online, temp_gauges \
WHERE \
 CAST(ccm2_rivers.number AS BIGINT) = ts_objects.fid_gauge AND \
 ts_objects.id_time_series = ts_data_online.fid_time_series AND \
 ccm2_rivers.number = temp_gauges.gauge AND \
 ts_objects.variable = \'Q\' AND \
 ts_data_online.time_stamp >= %s AND  \
 ts_data_online.time_stamp <= %s AND \
 ts_data_online.value IS NOT NULL \
GROUP BY ccm2_rivers.number, temp_gauges.id, temp_gauges.geom \
) \
SELECT return_periods.tn_1_11, return_periods.tn_1_5,  return_periods.tn_2, return_periods.tn_5, temp_max.gauges, temp_max.q_max, temp_max.geom \
FROM  \
 public.ccm2_rivers, public.tn_estimation, public.return_periods, temp_max \
WHERE  \
 CAST(ccm2_rivers.number AS BIGINT) = tn_estimation.fid_gauge AND \
 tn_estimation.id_tn_method = return_periods.fid_tn_method AND \
 ccm2_rivers.number = temp_max.gauges AND \
 tn_estimation.tn_baseperiod = \'3\' AND \
tn_estimation.tn_method_code = \'6\';'


def classify_qmax(SQL, target_list, start, end):
    SQL=cur.mogrify(SQL, (start, end))
    cur.execute(SQL)
    rps_all = cur.fetchall()
    for rps in rps_all:
        q=rps['q_max']
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
            rp_class = 'NULL'
            q = 'NULL'

        # if rps['gauges'] == "26500100":

        #store results in dictionary
        # pdb.set_trace()
        # rps=dict(rps)
        attr = {'number': rps['gauges'], 'qmax':q, 'rp_class':rp_class,
                'geom': json.loads(rps['geom'])}
        target_list.append(attr)

    return target_list

gauge_attributes=[]
temp=classify_qmax(SQL, gauge_attributes, start, end)

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

geo_str=create_featuresCollection(temp)
print "Content-type: text/javascript\n\n";
print geo_str

