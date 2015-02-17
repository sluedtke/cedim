// General region and projection settings
//
var lon =10.5;
var lat =51.0;
var zoom = 6.35;

// var map, base_layer, gauges, basins, lonlat, panel, gridPanel;
var prj4326 = new OpenLayers.Projection("EPSG:4326");
var prjmerc = new OpenLayers.Projection("EPSG:900913");
var zoom_lev = 6;
var max_res = 156543.0399;
var lonlat = new OpenLayers.LonLat(lon, lat).transform(prj4326, prjmerc);
// We create the basis for both layers, to my understading, just making a copy or clone is
// pretty difficult since evenhandles and so forth associated with the objects might mess
// things up
//
//
var bounds = new OpenLayers.Bounds();
bounds.extend(new OpenLayers.LonLat(645413.88354268, 5933971.9635739));
bounds.extend(new OpenLayers.LonLat(1692295.4227907, 7308615.4800631));
bounds.toBBOX();

var theme="toner-background"
var base_layer_ud = new OpenLayers.Layer.Stamen(theme);
// var base_layer_ud = new OpenLayers.Layer.Stamen("toner-lite");
var map_ud = new OpenLayers.Map({
						  // maxResolution: max_res,
						  numZoomLevels: zoom_lev,
						  units: 'm',
						  projection: prjmerc,
						  displayProjection: prj4326, 
						  restrictedExtent: bounds, 
						  maxExtent: bounds

});

var base_layer_hist = new OpenLayers.Layer.Stamen(theme);
var map_hist = new OpenLayers.Map({
						  // maxResolution: max_res,
						  numZoomLevels: zoom_lev,
						  units: 'm',
						  projection: prjmerc,
						  displayProjection: prj4326,
						  restrictedExtent: bounds,
						  maxExtent: bounds
});

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

// inundation_maps
inund_maps_ud = new OpenLayers.Layer.Vector("Inundation maps", {
});


