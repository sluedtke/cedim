Ext.onReady(function() {
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

});

