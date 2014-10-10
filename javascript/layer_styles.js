river_styles = new OpenLayers.StyleMap({});
var river_default={
  0: {strokeColor: colorbrewer.RdYlGn[4][3], strokeWidth: 2},
  1: {strokeColor: colorbrewer.RdYlGn[4][2], strokeWidth: 2},
  2: {strokeColor: colorbrewer.RdYlGn[4][1], strokeWidth: 2},
  3: {strokeColor: colorbrewer.RdYlGn[4][0], strokeWidth: 2}
}
river_styles.addUniqueValueRules("default", "rp_class", river_default);


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
