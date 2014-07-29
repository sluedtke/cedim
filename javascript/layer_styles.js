myStyles = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				fillColor: "${getColor}",                         
				// fillColor: "${fillcolor}",
				strokeColor: "#00FF01", 
				fillOpacity: 0.5, 
				label: "${name}",
				// pointRadius: "${id}"
				pointRadius: 12},
				{
                context: {
                    getColor : function (feature) {
                        return feature.attributes.id > 1 ? '#800026' :
                               feature.attributes.id > 2 ? '#BD0026' :
                               feature.attributes.id > 3 ? '#FED976' :
                                                                    '#FFEDA0' ;
                    }
                }
		}), 
		"select": new OpenLayers.Style({
                    fillColor: "#FF0000",
                    strokeColor: "#3399ff",
		})
})
