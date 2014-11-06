
gauge_styles = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				// lineColor: "${getColor}",
				strokeWidth: 0.5,
				fillOpacity: 0.6,
				pointRadius: 3,
				fillColor: colorbrewer.RdYlGn[4][0]
		})
});

base_river_styles = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({ 
				strokeColor: '#0000CC',
				strokeWidth: 1
		})
});
