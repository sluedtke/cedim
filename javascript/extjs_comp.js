
function update_rtp(start_date, end_date, bp_value, rp_array) {
		
		//----------------------------------//
		//get the length of the return period array
		var rp_length=Ext.getCmp('rp_value').getValue().rp_value.length;
		// and the array itself
		var rp_array=Ext.getCmp('rp_value').getValue().rp_value
		// dummy var to push the rules into
		var rules = [];
		// first class we start with
		rp_class=1;

		for(i=0; i<rp_length; i++){

				// get the choosen return period at index i
				text="return period: " + rp_array[i];
				// the colors are inverted .. 
				color_index=rp_length-(i+1);

				temp=new OpenLayers.Rule({
						title: text, 
						filter: new OpenLayers.Filter.Comparison({
								type: OpenLayers.Filter.Comparison.EQUAL_TO,
								property: "rp_class",
								value: rp_class
						}),
						symbolizer: {
								// rp_length defines the colors to chose from ,color index the position in that vector
								strokeColor: colorbrewer.RdYlGn[rp_length][color_index],
								strokeWidth: 4
						}
				});
				// increment by one
				rp_class=rp_class+1;
				// add to dummy variable 
				rules.push(temp);
		};
		var river_styles= new OpenLayers.StyleMap(new OpenLayers.Style({}, {rules: rules}))

		rivers_hist.styleMap=river_styles;
		rivers_ud.styleMap=river_styles;

		//----------------------------------//

		//Setting the parameters for the current situation 
		// format the dates that the query likes it
		//
		start=Ext.Date.format(start_date, 'Y-m-d');
		river_ud_ft.proxy.protocol.params.start_date = start;
        //
		end=Ext.Date.format(end_date, 'Y-m-d');
		river_ud_ft.proxy.protocol.params.end_date = end;
        //
		// //the return periods
		rp_array=JSON.stringify(rp_array)


		river_ud_ft.proxy.protocol.params.rp_array = rp_array;
		river_ud_ft.autoLoad=true;

		//Setting the parameters for the historic situation
		river_hist_ft.proxy.protocol.params.rp_array = rp_array;
		river_hist_ft.proxy.protocol.params.bp_value=bp_value.bp_value;
		river_hist_ft.autoLoad=true;

		// load the feature stores with the new parameters
		river_ud_ft.load();
		river_hist_ft.load();

		// Update the LegendPanel
		// http://www.geoext.org/pipermail/users/2013-August/003337.html
		for(i=0; i<legend_panel.items.items.length; i++) {
				// Note: 'Polygons' is the layer name
				if(legend_panel.items.items[i].layer.name == 'Classified river network') {
						legend_panel.items.items[i].setRules();
						legend_panel.items.items[i].update()
						break;
				}
		}

};

Ext.require([
    'Ext.form.*',
    'Ext.layout.container.Border',
    'GeoExt.panel.Map', 
    'GeoExt.container.VectorLegend',
    'GeoExt.panel.Legend'
]);

Ext.onReady(function() {

		var arr_layers=[];
		// arr_layers.push(gauges_ud);
		arr_layers.push(base_river_ud);
		arr_layers.push(rivers_ud);


		mappanel_ud = Ext.create('GeoExt.panel.Map', {
				title: 'The current situation in Germany',
				id: 'mappanel_ud',
				region: "west",
				width: 400,
				map: map_ud,
				layers: [base_layer_ud, gauges_ud, base_river_ud, rivers_ud],
				zoom: zoom,
				center: lonlat
		}); 

		//----------------------------------//

		var	mappanel_hist = Ext.create('GeoExt.panel.Map', {
				title: 'A given historic situation',
				id: 'mappanel_hist',
				region: "east",
				width: 400,
				map: map_hist,
				layers: [base_layer_hist, gauges_hist, base_river_hist, rivers_hist],
				zoom: zoom,
				center: lonlat
		});

		//----------------------------------//

		var start_default=new Date();
		start_default.setDate(start_default.getDate()-14);

		var end_default=new Date();
		end_default.setDate(end_default.getDate()-1);


		var daterange =Ext.create('Ext.panel.Panel', {
				title: 'Date range',
				width: 250,
				layout: {
						type: 'vbox',       // Arrange child items vertically
						align: 'stretch',    // Each takes up full width
						padding: 10
				},
				items: [
						{
						//------------------------//
						xtype: 'datefield',
						name: 'start_date',
						allowBlank: false,
						id: 'start_date',
						fieldLabel: 'Start date',
						hideLabel: false,
						value: start_default
				},{
						//------------------------//
						xtype: 'datefield',
						name: 'end_date',
						allowBlank: false,
						id: 'end_date',
						fieldLabel: 'End date',
						hideLabel: false,
						value: end_default
				}
				]
		});

		var ref_period = Ext.create('Ext.panel.Panel', {
				title: 'Reference period',
				width: 250,
				layout: {
						type: 'vbox',       // Arrange child items vertically
						align: 'stretch',    // Each takes up full width
						padding: 10
				},
				items: [
						{
						xtype: 'radiogroup',
						// fieldLabel: 'Choose a reference period',
						name: 'bp_value',
						id: 'bp_value',
						// Arrange checkboxes into two columns, distributed vertically
						columns: 2,
						padding: 10,
						vertical: true,
						items: [
								{ boxLabel: 'Year 1954', name: 'bp_value', inputValue: 1954},
								{ boxLabel: 'Year 2002', name: 'bp_value', inputValue: 2002, checked: true },
								{ boxLabel: 'Year 2012', name: 'bp_value', inputValue: 2013}
						]
				}]
		});

		rt_period = Ext.create('Ext.panel.Panel', {
				title: 'Return periods',
				width: 250,
				layout: {
						type: 'vbox',       // Arrange child items vertically
						align: 'stretch',    // Each takes up full width
						padding: 10,
						frame: false
				},
				items: [
						{
						xtype: 'checkboxgroup',
						// fieldLabel: 'Choose a set of return periods',
						name: 'rp_value',
						id: 'rp_value',
						// Arrange checkboxes into two columns, distributed vertically
						columns: 2,
						padding: 10,
						// copied from 
						// http://stackoverflow.com/questions/13487320/restrict-selected-checkboxes-to-number-of-5
						// listeners: {
						// 		change: function(cb, nv, ov) {
						// 				if(Ext.isArray(nv.rp_value)) {
						// 						if(nv.rp_value.length > 3){
						// 								cb.markInvalid('You can select only 5!');
						// 						} else {
						// 								cb.clearInvalid(); 
						// 						}
						// 				} else {
						// 						cb.markInvalid('You need to select at least 2!');
						// 				}
						// 		}
						// },
						vertical: true,
						items: [
								{ boxLabel: '1', name: 'rp_value', inputValue: 1},
								{ boxLabel: '2', name: 'rp_value', inputValue: 2, checked: true },
								{ boxLabel: '5', name: 'rp_value', inputValue: 5, checked: true },
								{ boxLabel: '10', name: 'rp_value', inputValue: 10},
								{ boxLabel: '20', name: 'rp_value', inputValue: 20},
								{ boxLabel: '50', name: 'rp_value', inputValue: 50},
								{ boxLabel: '100', name: 'rp_value', inputValue: 100, checked: true },
						]
				}
				]
		});

		var submit = Ext.create('Ext.panel.Panel', {
				width: 250,
				layout: {
						type: 'vbox',       // Arrange child items vertically
						align: 'stretch',    // Each takes up full width
						padding: 10
				},
				defaults: {
						frame: false
				},
				items: [
						{
						//------------------------//
						xtype: 'button',
						text: 'Spin the wheel',
						listeners: {
								click: function() {
										update_rtp(
												Ext.getCmp('start_date').getValue(),
												Ext.getCmp('end_date').getValue(), 
												Ext.getCmp('bp_value').getValue(),
												// the next one is an array
												// and not a single value
												Ext.getCmp('rp_value').getValue()
										)
								}
						}
				}
				]

		});

		//----------------------------------//
		//
		legend_panel = Ext.create('GeoExt.panel.Legend', {
				title: "Legend",
				defaults: {
						labelCls: 'mylabel',
						style: 'padding:5px'
				},
				bodyStyle: 'padding:5px',
				width: 350,
				autoScroll: true, 
				// region: 'west'
		});

		//----------------------------------//
		//
		// var toolbar =Ext.create('Ext.toolbar.Toolbar', {
		var toolbar =Ext.create('Ext.panel.Panel', {
				width: 250,
				layout: {
						type: 'vbox',
						// align: 'stretch',    // Each takes up full width
						// padding: 10,
				},
				items: [daterange, ref_period, rt_period, submit, legend_panel],
				defaults: {
						frame: false
				}
		});

		//----------------------------------//
		//----------------------------------//
		// main panel
		Ext.create('Ext.panel.Panel', {
				id:'main-panel',
				// baseCls:'x-plain',
				renderTo: 'mainpanel',
				layout: {
						type: 'table',
						// type: 'border'
						// The total column count must be specified here
						columns: 3
				},
				items: [mappanel_ud, toolbar, mappanel_hist],
				defaults: {
						height: 1200,
						frame: false
				}
		});

		//----------------------------------//

		// Adapted from
		// http://osgeo-org.1560.x6.nabble.com/Synchronize-position-and-zoom-of-two-maps-td3911331.html
		var c1, c2, z1, z2;
		var updatingMap1 = false;
		var updatingMap2 = false;

		if(mappanel_hist.rendered){
				map_ud.events.register(['moveend'], map_ud, function() {
						if(!updatingMap2){
								c1 = this.getCenter();
								z1 = this.getZoom();
								updatingMap1 = true;
								map_hist.moveTo(c1, z1);
								updatingMap1 = false;
						}
				});
		}; 

		if(mappanel_ud.rendered){
				map_hist.events.register(['moveend'], map_hist, function() {
						if(!updatingMap2){
								c2 = this.getCenter();
								z2 = this.getZoom();
								updatingMap2 = true;
								map_ud.moveTo(c2, z2);
								updatingMap2 = false;
						}
				}); 
		}; 
});

