// a rule for the gauges
var gauge_rules=new OpenLayers.Rule({
		title: " ",
		filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "id",
				value: 0 
		}),
		symbolizer: {
				// rp_length defines the colors to chose from ,color index the position in that vector
				strokeWidth: 0.5,
				fillOpacity: 0.6,
				pointRadius: 3,
				fillColor: colorbrewer.RdYlGn[4][0]
		}
});

var gauge_rules_array = [];
gauge_rules_array.push(gauge_rules);

var gauge_styles= new OpenLayers.StyleMap(new OpenLayers.Style({}, {rules: gauge_rules_array}));

gauges_ud.styleMap=gauge_styles;
gauges_hist.styleMap=gauge_styles;



// a rule for the rivers
var river_rules=new OpenLayers.Rule({
		title: " ",
		filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "id",
				value: 0 
		}),
		symbolizer: {
				// rp_length defines the colors to chose from ,color index the position in that vector
				strokeColor: '#0000CC',
				strokeWidth: 0.8
		}
});

var river_rules_array = [];
river_rules_array.push(river_rules);

var river_styles= new OpenLayers.StyleMap(new OpenLayers.Style({}, {rules: river_rules_array}));


base_river_ud.styleMap=river_styles;
base_river_hist.styleMap=river_styles;
