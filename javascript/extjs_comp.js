
function update_rtp(start_date, end_date, bp_value, rp_array) {
		
		//----------------------------------//
		//get the length of the return period array
		var rp_length=Ext.getCmp('rp_value').getValue().rp_value.length;
		// and the array itself
		var rp_array=Ext.getCmp('rp_value').getValue().rp_value
		// dummy var to push the rules into
		rules = [];

		// a rule for the rp_class 0
		var temp=new OpenLayers.Rule({

				title: "< " + rp_array[0],
				filter: new OpenLayers.Filter.Comparison({
						type: OpenLayers.Filter.Comparison.EQUAL_TO,
						property: "rp_class",
						value: 0 
				}),
				symbolizer: {
						// rp_length defines the colors to chose from ,color index the position in that vector
						strokeColor: '#0000CC',
						strokeWidth: 2
				}
		});
		
		rules.push(temp);


		// first class we start with
		rp_class=1;
		for(i=0; i<rp_length; i++){
				text=rp_array[i] + " years";

				// the colors are inverted .. 
				color_index=rp_length-(i+1);

				var temp=new OpenLayers.Rule({
						title: text, 
						filter: new OpenLayers.Filter.Comparison({
								type: OpenLayers.Filter.Comparison.EQUAL_TO,
								property: "rp_class",
								value: rp_class
						}),
						symbolizer: {
								// rp_length defines the colors to chose from ,color index the position in that vector
								strokeColor: colorbrewer.RdYlGn[rp_length][color_index],
								strokeWidth: 3
						}
				});
				// increment by one
				rp_class=rp_class+1;
				// add to dummy variable 
				rules.push(temp);
		};

		// Assign to object
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
		load_mask_ud.show();

		river_hist_ft.load();
		load_mask_hist.show();

		// Update the LegendPanel
		// http://www.geoext.org/pipermail/users/2013-August/003337.html
		for(i=0; i<legend_panel.items.items.length; i++) {
				// Note: 'Polygons' is the layer name
				if(legend_panel.items.items[i].layer.name == "Return periods"){
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

		mappanel_ud = Ext.create('GeoExt.panel.Map', {
				title: 'The current situation in Germany',
				id: 'mappanel_ud',
				region: "west",
				width: 430,
				map: map_ud,
				layers: [base_layer_ud, gauges_ud, base_river_ud, rivers_ud],
				zoom: zoom,
				center: lonlat
		}); 

		//----------------------------------//

		var	mappanel_hist = Ext.create('GeoExt.panel.Map', {
				title: 'A historic flood event',
				id: 'mappanel_hist',
				region: "east",
				width: 430,
				map: map_hist,
				layers: [base_layer_hist, gauges_hist, base_river_hist, rivers_hist],
				zoom: zoom,
				center: lonlat
		});

		//----------------------------------//
		//
		legend_panel = Ext.create('GeoExt.panel.Legend', {
				title: "Legend",
				width: 140,
				defaults: {
						labelCls: 'mylabel',
						padding: 10,
				},
				layout: {
						type: 'table',
						columns: 1
				},
				autoScroll: true, 
		});

		//----------------------------------//

		var start_default=new Date();
		start_default.setDate(start_default.getDate()-14);

		var end_default=new Date();
		end_default.setDate(end_default.getDate()-1);

		var setting_panel_height=130

		var daterange =Ext.create('Ext.form.Panel', {
				title: 'Date range',
				columnWidth: 0.4,
				height: setting_panel_height,
				items: [
						{
						//------------------------//
						xtype: 'datefield',
						name: 'start_date',
						allowBlank: false,
						id: 'start_date',
						fieldLabel: 'Start date',
						hideLabel: false,
						padding: 10,
						value: start_default
				},{
						//------------------------//
						xtype: 'datefield',
						name: 'end_date',
						allowBlank: false,
						id: 'end_date',
						fieldLabel: 'End date',
						hideLabel: false,
						padding: 10,
						value: end_default
				}
				]
		});

		var ref_period = Ext.create('Ext.form.Panel', {
				title: 'Historic flood event',
				// width: 150,
				columnWidth: 0.2,
				height: setting_panel_height,
				items: [
						{
						xtype: 'radiogroup',
						// fieldLabel: 'Choose a reference period',
						name: 'bp_value',
						id: 'bp_value',
						padding: 10,
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						items: [
								{ boxLabel: 'Year 1954', name: 'bp_value', inputValue: 1954},
								{ boxLabel: 'Year 2002', name: 'bp_value', inputValue: 2002, checked: true },
								{ boxLabel: 'Year 2013', name: 'bp_value', inputValue: 2013}
						]
				}]
		});

		//----------------------------------//
		//
		// var submit = Ext.create('Ext.panel.Panel', {
		var submit = Ext.create('Ext.button.Button', {
				// 		bodyPadding: 10,
				text: 'Spin the wheel',
				border: false,
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

		});

		//----------------------------------//
		//
		var rt_period = Ext.create('Ext.form.Panel', {
				title: 'Return periods',
				// width: 350,
				columnWidth: 0.4,
				height: setting_panel_height,
				// border: false,
				items: [
						{
						xtype: 'checkboxgroup',
						// fieldLabel: 'Choose a set of return periods',
						name: 'rp_value',
						id: 'rp_value',
						// Arrange checkboxes into 4 columns, distributed vertically
						columns: 3,
						vertical: true,
						items: [
								{ boxLabel: '1', name: 'rp_value', inputValue: 1, padding: 5},
								{ boxLabel: '1.5', name: 'rp_value', inputValue: 1.5, padding: 5},
								{ boxLabel: '2', name: 'rp_value', inputValue: 2, checked: true, padding: 5},
								{ boxLabel: '5', name: 'rp_value', inputValue: 5, checked: true, padding: 5},
								{ boxLabel: '10', name: 'rp_value', inputValue: 10, padding: 5},
								{ boxLabel: '25', name: 'rp_value', inputValue: 25, padding: 5},
								{ boxLabel: '50', name: 'rp_value', inputValue: 50, padding: 5},
								{ boxLabel: '75', name: 'rp_value', inputValue: 75, padding: 5},
								{ boxLabel: '100', name: 'rp_value', inputValue: 100, checked: true, padding: 5},
						]
				}
				],
				dockedItems: [{
						xtype: 'toolbar',
						dock: 'right',
						border: false,
						// defaults: {minWidth: minButtonWidth},
						items: [
								submit
						], 
						border: false,
						layout: {
								pack: 'center',
						}	
				}]
		});

		//----------------------------------//
		//
		// var toolbar =Ext.create('Ext.toolbar.Toolbar', {
		var toolbar =Ext.create('Ext.panel.Panel', {
				width: 1000,
				// title: "Setttings",
				height: setting_panel_height,
				colspan: 3,
				layout: {
						type: 'column',
						align: 'stretch',    // Each takes up full width
						columns: 3
				},
				items: [daterange, ref_period, rt_period],
		});

		//----------------------------------//
		// main panel
		var mainpanel=Ext.create('Ext.panel.Panel', {
				id:'mainanel',
				// baseCls:'x-plain',
				renderTo: 'mainpanel',
				layout: {
						type: 'table',
						columns: 3
				},

				defaults: { 
					   	// collapsible: true,
						// split: true,
						height: 600,
				},
				items: [
						mappanel_ud,
						mappanel_hist,
						legend_panel,
						toolbar
				]
		});


		//----------------------------------//
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

