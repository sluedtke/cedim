// Basic java functions that create the base layers
//
$(function(){
		fromProj = new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        toProj = new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
		// Berlin
		var lon =10.3;
		var lat =51.5;
        var zoom = 6.4;

        
		map = new OpenLayers.Map("map", {
				 controls:[
						 new OpenLayers.Control.Navigation(),
						 new OpenLayers.Control.PanZoomBar(),
						 new OpenLayers.Control.Attribution(), 
						 new OpenLayers.Control.LayerSwitcher(),
						 new OpenLayers.Control.OverviewMap()
				 ],
						 displayProjection: new OpenLayers.Projection("EPSG:4326")}
						);

        var base_layer = new OpenLayers.Layer.OSM();
        map.addLayer(base_layer);


        lonlat = new OpenLayers.LonLat(lon, lat).transform(fromProj, toProj);
        // lonlat = new OpenLayers.LonLat(lon, lat);
        map.setCenter(lonlat, zoom);
});

//#####################################################################

$(function(){
		var xmlhttp = false;
		if (window.XMLHttpRequest) {
				// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange=function() {
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
						// document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
						var geojson=xmlhttp.responseText;
						visualize_gauge(geojson, "Gauging stations");
				};
		};

		gauge = 'query=gauge';
		xmlhttp.open("GET", "./cgi-bin/get_base.py?"+gauge,true);
		xmlhttp.send(null);
});

function visualize_gauge(geojson, layer){
		var featurecollection = JSON.parse(geojson);
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var vector_layer = new OpenLayers.Layer.Vector(layer, {
				styleMap:gauge_styles 
		});
		map.addLayer(vector_layer);
		vector_layer.addFeatures(geojson_format.read(featurecollection));
};

//
$(function(){
		var xmlhttp = false;
		if (window.XMLHttpRequest) {
				// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange=function() {
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
						// document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
						var geojson=xmlhttp.responseText;
						visualize_base(geojson, "Catchment boundaries");
				};
		};
		catchment='query=catch';
		xmlhttp.open("GET", "./cgi-bin/get_base.py?"+catchment,true);
		xmlhttp.send(null);
});
//
function visualize_base(geojson, layer){
		var featurecollection = JSON.parse(geojson);
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var vector_layer = new OpenLayers.Layer.Vector(layer, {
				styleMap:admin_styles 
		});
		map.addLayer(vector_layer);
		vector_layer.addFeatures(geojson_format.read(featurecollection));
};



// Datapicker range
$(function() {
		var currentDate = new Date();
		$( "#start_date" ).datepicker({
				defaultDate: "-2w",
				changeMonth: true,
				numberOfMonths: 2,
				maxDate: "-2d",
				minDate: "-1w",
				dateFormat: 'yy-mm-dd',
				onClose: function( selectedDate ) {
						$( "#end_date" ).datepicker( "option", "minDate", selectedDate );
				}
		}).datepicker("setDate", new Date());

		$( "#end_date" ).datepicker({
				changeMonth: true,
				defaultDate: "-2d",
				numberOfMonths: 2,
				maxDate: "-2d",
				minDate: "-2d",
				dateFormat: 'yy-mm-dd',
				onClose: function( selectedDate ) {
						$( "#from_date" ).datepicker( "option", "maxDate", selectedDate );
				}
		}).datepicker("setDate", new Date());
});

