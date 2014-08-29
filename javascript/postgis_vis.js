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
		xmlhttp.open("GET", "../cgi-bin/rtp.py?"+qstr,true);
		xmlhttp.send();
};

function visualize_query(geojson){
		var featurecollection = JSON.parse(geojson);
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var vector_layer = new OpenLayers.Layer.Vector("rivers", {
				eventListeners:{
						'featureselected':function(evt){
								var feature = evt.feature;
								var popup = new OpenLayers.Popup.FramedCloud("chicken",
																			 feature.geometry.getBounds().getCenterLonLat(),
																			 null,
																			 "<div style='font-size:.8em'>ID: " + feature.attributes.id
																			 +"<br>NAME: " 
																			 + feature.attributes.number
																			 +"<br>rp_class: " 
																			 + feature.attributes.rp_class+ "</div>",
																			 null, true
																			);
																			feature.popup = popup;
																			map.addPopup(popup);
						},
						'featureunselected':function(evt){
								var feature = evt.feature;
								map.removePopup(feature.popup);
								feature.popup.destroy();
								feature.popup = null;
						}
				},
				styleMap:river_styles 
		});

		map.addLayer(vector_layer);
		vector_layer.addFeatures(geojson_format.read(featurecollection));

		selectControl = new OpenLayers.Control.SelectFeature(
				[vector_layer],
				{
						clickout: false, toggle: false, multiple: false, hover: true,
						toggleKey: "ctrlKey", // ctrl key removes from selection
						multipleKey: "shiftKey" // shift key adds to selection
				}
		);
		map.addControl(selectControl);
		selectControl.activate();

		vector_layer.events.on({
				"featureselected": function(e) {
						showStatus("selected feature " +e.feature.attributes.name+ " on Vector Layer 1");
				},
				"featureunselected": function(e) {
						showStatus("unselected feature "+e.feature.attributes.name+" on Vector Layer 1");
				}
		});
};

function showStatus(text) {
		document.getElementById("status").innerHTML = text;            
};

