river_styles = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				// fillColor: "${getColor}",                         
				// fillColor: "${fillcolor}",
				// strokeColor: "#00FF01", 
				strokeColor: "${getColor}",
				// lineColor: "${getColor}",
				strokeWidth: 2,
				fillOpacity: 0.5
				// label: "${name}",
				// pointRadius: "${id}"
				// pointRadius: 12},
		},
				{
                context: {
                    getColor : function (feature) {
                        // return feature.attributes.id > 1 ? '#800026' :
                        //        feature.attributes.id > 2 ? '#BD0026' :
                        //        feature.attributes.id > 3 ? '#FED976' :
                                                                    // '#FFEDA0' ;
                       return feature.attributes.rp_class > 0 ? '#800026' :
							   feature.attributes.rp_class > 1 ? '#800026' :
                               feature.attributes.rp_class > 2 ? '#BD0026' :
                               feature.attributes.rp_class > 3 ? '#FED976' :
                                                                    '#FFEDA0' ;
                    }
                }
		}), 
		"select": new OpenLayers.Style({
                    // fillColor: "#FF0000",
                    strokeColor: "#3399ff"
		})
});

admin_styles = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				// lineColor: "${getColor}",
				strokeWidth: 0.5,
				fillOpacity: 0.2,
				pointRadius: 4
		})
});

gauge_styles = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				// lineColor: "${getColor}",
				strokeWidth: 0.5,
				fillOpacity: 0.6,
				pointRadius: 3
		})
});
