WITH 
temp_gauges AS ( 
SELECT gid AS id, number AS gauge
FROM  
 ccm2_rivers
), 
temp_max AS ( 
SELECT MAX(ts_data.value) AS q_max, ccm2_rivers.number AS gauges, temp_gauges.id
FROM 
 public.ccm2_rivers, public.ts_objects, public.ts_data, temp_gauges 
WHERE 
 CAST(ccm2_rivers.number AS BIGINT) = ts_objects.fid_gauge AND 
 ts_objects.id_time_series = ts_data.fid_time_series AND 
 ccm2_rivers.number = temp_gauges.gauge AND 
 ts_objects.variable = 'Q' AND 
ts_data.time_stamp >= '2013-05-20' AND 
ts_data.time_stamp <= '2013-06-20' AND 
--  ts_data.time_stamp >= %s AND  
--  ts_data.time_stamp <= %s AND 
 ts_data.value IS NOT NULL 
GROUP BY ccm2_rivers.number, temp_gauges.id
) 
SELECT return_periods.tn_1_11, return_periods.tn_1_5,  return_periods.tn_2,
return_periods.tn_5, temp_max.gauges, temp_max.q_max
FROM  
 public.ccm2_rivers, public.tn_estimation, public.return_periods, temp_max 
WHERE  
 CAST(ccm2_rivers.number AS BIGINT) = tn_estimation.fid_gauge AND 
 tn_estimation.id_tn_method = return_periods.fid_tn_method AND 
 ccm2_rivers.number = temp_max.gauges AND 
 tn_estimation.tn_baseperiod = '3' AND 
tn_estimation.tn_method_code = '6';
