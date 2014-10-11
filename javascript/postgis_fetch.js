function update_rtp(store, start_date, end_date) {
		// format the dates that the query likes it
		//
		start=Ext.Date.format(start_date, 'Y-m-d');
		store.proxy.protocol.params.start_date = start;

		end=Ext.Date.format(end_date, 'Y-m-d');
		store.proxy.protocol.params.end_date = end;
		
		store.autoLoad=true;

		store.load();

};

Ext.require([
    'Ext.form.*'
]);

Ext.onReady(function() {

			mappanel_ud = Ext.create('GeoExt.panel.Map', {
					title: 'The current situation in Germany',
					id: 'mappanel_ud',
					region: "west",
					map: map_ud,
					layers: [base_layer_ud, gauges_ud, rivers_ud, base_river_ud],
					zoom: zoom,
					center: lonlat
			}); 


			var gauge_ud_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: gauges_ud,
					fields: [
							{name: 'id', type: 'numeric'},
							{name: 'name', type: 'string'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									url: "cgi-bin/get_base.py",
									params: {
											query: 'gauge'},
											format: new OpenLayers.Format.GeoJSON()
							})
					}),
					autoLoad: true
			});

			var river_ud_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: rivers_ud,
					fields: [
							// {name: 'number', type: 'numeric'},
							{name: 'rp_class', type: 'numeric'}
							// {name: 'qmax', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									type: 'ajax',
									url: "cgi-bin/rtp.py",
									params: {
											start_date: '2014-09-25', 
											end_date: '2014-09-28'
									},
									format: new OpenLayers.Format.GeoJSON()
							})
					}), 
					autoLoad: false
			});

			var base_river_ud_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: base_river_ud,
					fields: [
							{name: 'id', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									url: "cgi-bin/get_base.py",
									params: {
											query: 'river'
									},
									format: new OpenLayers.Format.GeoJSON()
							})
					}), 
					autoLoad: true 
			});

			//----------------------------------//
			//
			var mappanel_hist = Ext.create('GeoExt.panel.Map', {
					title: 'A given historic situation',
					id: 'mappanel_hist',
					region: "east",
					map: map_hist,
					layers: [base_layer_hist, gauges_hist, rivers_hist, base_river_hist],
					zoom: zoom,
					center: lonlat
			});

			var gauge_hist_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: gauges_hist,
					fields: [
							{name: 'id', type: 'numeric'},
							{name: 'name', type: 'string'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									url: "cgi-bin/get_base.py",
									params: {
											query: 'gauge'},
											format: new OpenLayers.Format.GeoJSON()
							})
					}),
					autoLoad: true
			});

			var river_hist_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: rivers_hist,
					fields: [
							// {name: 'number', type: 'numeric'},
							{name: 'rp_class', type: 'numeric'}
							// {name: 'qmax', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									url: "cgi-bin/rtp.py",
									params: {
											start_date: '2014-09-25', 
											end_date: '2014-09-28'
									},
									format: new OpenLayers.Format.GeoJSON()
							})
					}), 
					autoLoad: false
			});

			var base_river_hist_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: base_river_hist,
					fields: [
							{name: 'id', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									type: 'ajax',
									url: "cgi-bin/get_base.py",
									params: {
											query: 'river'
									},
									format: new OpenLayers.Format.GeoJSON()
							})
					}), 
					autoLoad: true 
			});

			//----------------------------------//
			//----------------------------------//

			var start_default=new Date();
			start_default.setDate(start_default.getDate()-14);

			var end_default=new Date();
			end_default.setDate(end_default.getDate()-1);

			datepanel =	Ext.create('Ext.panel.Panel', {
					title: 'Date range selection',
					autoEl: 'div',  // This is the default
					// layout: 'table',
					width: 300,
					defaults: {
							// implicitly create Container by specifying xtype
							xtype: 'container',
							autoEl: 'div', // This is the default.
							layout: 'form',
							style: {
									padding: '10px', 
							}
					},
					//  The two items below will be Ext.Containers, each encapsulated by a <DIV> element.
					items: [{
							items: {
									xtype: 'datefield',
									name: 'start_date',
									allowBlank: false,
									id: 'start_date',
									fieldLabel: 'Start date',
									hideLabel: false,
									value: start_default}
					},
					{
							items: {
									xtype: 'datefield',
									name: 'end_date',
									allowBlank: false,
									id: 'end_date',
									fieldLabel: 'End date',
									hideLabel: false,
									value: end_default}
					},
					{
							items: {
									xtype: 'button',
									text: 'Click me',
									listeners: {
											click: function() {
													update_rtp(river_ud_ft,
															   Ext.getCmp('start_date').getValue(),
															   Ext.getCmp('end_date').getValue())
											}
									}
							}
					}]

			});

			// main panel
			Ext.create('Ext.panel.Panel', {
					id:'main-panel',
					// baseCls:'x-plain',
					renderTo: 'mainpanel',
					layout: {
							type: 'table',
							// The total column count must be specified here
							columns: 3
					},
					items: [mappanel_ud, datepanel, mappanel_hist],
					defaults: {
							frame: false,
							height: 600,
							width: 600
					},
			});

			// Add something like this:
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

