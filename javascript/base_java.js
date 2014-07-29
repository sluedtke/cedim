// Basic java functions
$(function(){
		var lon = 5;
		var lat = 60;
		var zoom = 5;

		map = new OpenLayers.Map("map", {
				projection: new OpenLayers.Projection("EPSG:4326")
		});

		layer=new OpenLayers.Layer.WMS( "OpenLayers WMS",
									   "http://vmap0.tiles.osgeo.org/wms/vmap0",
									   {layers: 'basic'});
									   map.addLayer(layer);
									   map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
});
