Ext.onReady(function() {
			//----------------------------------//
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

			//----------------------------------//
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

			//----------------------------------//
			river_ud_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: rivers_ud,
					fields: [
							{name: 'number', type: 'numeric'},
							{name: 'rp_class', type: 'numeric'},
							{name: 'qmax', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									type: 'ajax',
									url: "cgi-bin/rp_current.py",
									params: {
											start_date: 'dummy_value', 
											end_date: 'dummy_value',
											rp_array: 'dummy_value'
									},
									format: new OpenLayers.Format.GeoJSON(),
							})
					}), 
					autoLoad: false,
					LoadMask: true
			});

			//----------------------------------//
			river_hist_ft = new Ext.create("GeoExt.data.FeatureStore", {
					layer: rivers_hist,
					fields: [
							{name: 'number', type: 'numeric'},
							{name: 'rp_class', type: 'numeric'},
							{name: 'qmax', type: 'numeric'}
					],
					proxy: new Ext.create("GeoExt.data.proxy.Protocol", {
							protocol: new OpenLayers.Protocol.HTTP({
									url: "cgi-bin/rp_hist.py",
									params: {
											bp_value: 0,
											rp_array: 'dummy_value'
									},
									format: new OpenLayers.Format.GeoJSON()
							})
					}), 
					autoLoad: false,
					LoadMask: true
			});

		load_mask_ud = new Ext.LoadMask(
				Ext.getCmp('mappanel_ud'),
				{
						msg: 'Loading current data...', store: river_ud_ft
				});

		load_mask_hist = new Ext.LoadMask(
				Ext.getCmp('mappanel_hist'),
				{
						msg: 'Loading historical data...', store: river_hist_ft
				});


});

