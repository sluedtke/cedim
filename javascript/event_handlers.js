// A java script  file that stores the event handles for different layers.
myEvents=eventListeners:{
				'featureselected':function(evt){
						var feature = evt.feature;
						var popup = new OpenLayers.Popup.FramedCloud("popup",
																	 feature.geometry.getBounds().getCenterLonLat(),
																	 null,
																	 "<div style='font-size:.8em'>ID: " + feature.attributes.id
																	 +"<br>NAME: " 
																	 + feature.attributes.name+"</div>",
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
}
