WITH 
temp_gauges AS ( 
SELECT gid AS id,
 number AS gauge,
 ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom 
FROM 
 ccm2_rivers
), 

temp_max AS ( 
SELECT
 MAX(ts_data_online.value ) AS q_max,
 ccm2_rivers.number AS gauges,
 temp_gauges.id, 
 temp_gauges.geom
FROM 
public.ccm2_rivers, public.ts_objects, public.ts_data_online, temp_gauges 
WHERE 
 CAST(ccm2_rivers.number AS BIGINT) = ts_objects.fid_gauge AND 
 ts_objects.id_time_series = ts_data_online.fid_time_series AND 
 ccm2_rivers.number = temp_gauges.gauge AND 
 ts_objects.variable = 'Q' AND 
 ts_data_online.time_stamp >= '2014-10-30' AND 
 ts_data_online.time_stamp <= '2014-11-10' AND 
 ts_data_online.value IS NOT NULL AND
 ts_data_online.value != 'NaN'
GROUP BY ccm2_rivers.number, temp_gauges.id, temp_gauges.geom
), 

rp_select AS (
SELECT 
 return_periods_long.rp_code,
 temp_max.gauges,
 temp_max.q_max,
 return_periods_long.rps,
 (temp_max.q_max-return_periods_long.rps) AS diff, 
 temp_max.geom
FROM 
public.ccm2_rivers, public.tn_estimation, public.return_periods_long, temp_max 
WHERE 
CAST(ccm2_rivers.number AS BIGINT) = tn_estimation.fid_gauge AND 
tn_estimation.id_tn_method = return_periods_long.fid_tn_method AND 
ccm2_rivers.number = temp_max.gauges AND 
tn_estimation.tn_baseperiod = '3' AND 
tn_estimation.tn_method_code = '6' AND 
CAST(return_periods_long.rp_code AS FLOAT) IN (2, 10, 25, 50) 
ORDER BY gauges
),

ranked_q AS (
SELECT 
rp_code, gauges, rps, q_max, diff, rank()
OVER (PARTITION BY gauges ORDER BY diff DESC)
FROM rp_select
),

summed AS (
SELECT 
rp_code, gauges, rps, q_max, diff, rank,
((sum(diff) OVER (PARTITION BY gauges)) +
(sum(abs(diff)) OVER (PARTITION BY gauges))) AS sum_diff
FROM ranked_q
),

under_rp AS (
SELECT DISTINCT ON (gauges)
-- gauges, q_max 
rp_code, gauges, q_max, rps, (CAST(rank AS FLOAT)-1) AS rp_class
FROM summed
WHERE
sum_diff = 0
ORDER BY gauges, rps
),

--
classified_rp AS (
SELECT DISTINCT ON (gauges)
rp_code, gauges, q_max, rps, CAST(rank AS FLOAT) AS rp_class
FROM ranked_q
WHERE
diff >= 0 
ORDER BY gauges, diff ASC
),

--
all_rp AS (
SELECT * FROM classified_rp 
UNION ALL
SELECT * FROM under_rp
)


SELECT * FROM all_rp

