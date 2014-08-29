function getdatestring() {
		start_date=document.getElementById("start_date").value;
		end_date=document.getElementById("end_date").value;
		qstr = 'start_date=' + escape(start_date)+'&end_date=' + escape(end_date);  // NOTE: no '?' before querystring
		return qstr;
};

function sendRequest(){
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
						visualize_query(geojson);
				}
		}
		// xmlhttp.open("GET","get_proj.php?q="+str,true);
		qstr=getdatestring();
		xmlhttp.open("GET", "./cgi-bin/rtp.py?"+qstr,true);
		xmlhttp.send();
};

function visualize_query(geojson){
		var selectedFeature, selectControl;
		var featurecollection = JSON.parse(geojson);
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var vector_layer = new OpenLayers.Layer.Vector("rivers", {
				styleMap:river_styles 
		});

		map.addLayer(vector_layer);
		vector_layer.addFeatures(geojson_format.read(featurecollection));

		selectControl = new OpenLayers.Control.SelectFeature(
				vector_layer,
				{
						clickout: false, toggle: true, multiple: false, hover: false,
						toggleKey: "ctrlKey", // ctrl key removes from selection
						multipleKey: "shiftKey", box: true, // shift key adds to selection
						onSelect: onFeatureSelect, // will be called on feature select
						onUnselect: onFeatureUnselect // will be called on feature unselect
				}
		);

		map.addControl(selectControl);
		selectControl.activate();

		function onFeatureSelect(feature) {
				popup = new OpenLayers.Popup.FramedCloud("popup", 
														 feature.geometry.getBounds().getCenterLonLat(),
														 null,
														 "<div style='font-size:.8em'>ID: " + feature.attributes.id
														 +"<br>NAME: " 
														 + feature.attributes.number
														 +"<br>rp_class: " 
														 + feature.attributes.rp_class+ "</div>",
														 null, true, onPopupClose);
				 feature.popup = popup;
				 map.addPopup(popup, exclusive=true);
		};
		function onFeatureUnselect(feature) {
				map.removePopup(feature.popup);
				feature.popup.destroy();
				feature.popup = null;
		};
		function onPopupClose(evt) {
				selectControl.unselectAll();
		}
};
