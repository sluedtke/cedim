// General region and projection settings
//
var lon =10.5;
var lat =51.0;
var zoom = 6.35;

// var map, base_layer, gauges, basins, lonlat, panel, gridPanel;
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

map_ud.restrictedExtent = map_ud.getExtent();
map_hist.restrictedExtent = map_hist.getExtent();

// Vector base layers
// all gauges for Germany
gauges_ud = new OpenLayers.Layer.Vector("Gauges", {
});

gauges_hist = new OpenLayers.Layer.Vector("Gauges", {
});

//all rivers for Germany 
base_river_ud = new OpenLayers.Layer.Vector("River network", {
});
//all rivers for Germany 
base_river_hist = new OpenLayers.Layer.Vector("River network", {
});

// the color coded river block
rivers_ud = new OpenLayers.Layer.Vector("Return periods", {
});
// the color coded river block
rivers_hist = new OpenLayers.Layer.Vector("Return periods", {
});


