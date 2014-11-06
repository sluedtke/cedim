// General region and projection settings
//
var lon =10.3;
var lat =51.5;
var zoom = 6.4;

var map, base_layer, gauges, basins, lonlat, panel, gridPanel;
var prj4326 = new OpenLayers.Projection("EPSG:4326");
var prjmerc = new OpenLayers.Projection("EPSG:900913");
var zoom_lev = 20;
var max_res = 156543.0399;
var lonlat = new OpenLayers.LonLat(lon, lat).transform(prj4326, prjmerc);
// We create the basis for both layers, to my understading, just making a copy or clone is
// pretty difficult since evenhandles and so forth associated with the objects might mess
// things up
//
//
var base_layer_ud = new OpenLayers.Layer.Stamen("toner-background");
// var base_layer_ud = new OpenLayers.Layer.Stamen("toner-lines");
var map_ud = new OpenLayers.Map({
						  maxResolution: max_res,
						  numZoomLevels: zoom_lev,
						  units: 'm',
						  projection: prjmerc,
						  displayProjection: prj4326
						  
});

var base_layer_hist = new OpenLayers.Layer.Stamen("toner-background");
// var base_layer_hist = new OpenLayers.Layer.Stamen("toner-lite");
var map_hist = new OpenLayers.Map({
						  maxResolution: max_res,
						  numZoomLevels: zoom_lev,
						  units: 'm',
						  projection: prjmerc,
						  displayProjection: prj4326
});


// Vector base layers
// all gauges for Germany
gauges_ud = new OpenLayers.Layer.Vector("gauges_ud", {
				styleMap:gauge_styles 
});

gauges_hist = new OpenLayers.Layer.Vector("gauges_hist", {
				styleMap:gauge_styles 
});

//all rivers for Germany 
base_river_ud = new OpenLayers.Layer.Vector("base_rivers_ud", {
				styleMap: base_river_styles
});
//all rivers for Germany 
base_river_hist = new OpenLayers.Layer.Vector("base_rivers_hist", {
				styleMap: base_river_styles
});

// the color coded river block
rivers_ud = new OpenLayers.Layer.Vector("rivers_ud", {
});
// the color coded river block
rivers_hist = new OpenLayers.Layer.Vector("rivers_hist", {
});


