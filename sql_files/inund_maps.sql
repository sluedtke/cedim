WITH 

-- joining the dates from the metadata table to the layers

inund_date_join AS (
  SELECT 
  inund_maps.map_polygon.*,
  inund_maps.meta.aufnahmeda 
FROM 
inund_maps.map_polygon
INNER JOIN inund_maps.meta ON
map_polygon.fname=meta.filename)

-- SELECT date range
SELECT 
  inund_date_join.map_polygon_id, 
  inund_date_join.aufnahmeda AS date,
  ST_AsGeoJSON(ST_SIMPLIFY(ST_TRANSFORM(geom, 900913), 600)) AS geom
  -- ST_AsGeoJSON(ST_TRANSFORM(geom, 900913)) AS geom
FROM 
inund_date_join
WHERE (inund_date_join.gridcode = 2 OR inund_date_join.gridcode IS NULL);
-- inund_date_join.aufnahmeda >= '2013-06-03' AND
-- inund_date_join.aufnahmeda <= '2013-06-08';



