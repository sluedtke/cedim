/**
 * Main Application
 */

/**
 * Create layers for the OL map
 */
var layers = []  

var osm = new ol.layer.Tile({
    visible: false,
    source: new ol.source.XYZ({
         url: 'http://{a-c}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
    })
});

var stamen = new ol.layer.Tile({
    visible: true,
    source: new ol.source.Stamen({
        layer: 'toner-background'
    })
});


var waterways = new ol.layer.Vector({
    name: 'waterways',
        source: new ol.source.TileVector({
            format: new ol.format.TopoJSON({
                defaultProjection: 'EPSG:3857'
            }),
            projection: 'EPSG:3857',
            tileGrid: ol.tilegrid.createXYZ({
                minZoom: 0,
                maxZoom: 19
            }),
            url: 'http://localhost:8080/streams/{z}/{x}/{y}.topojson'
        }),
        style: (function() {
            return function(feature, resolution) {
                return [new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#99B3CC',
                        width: 2
                    }),

                })];
            };
        })()
});

var gauge_style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 3,
      fill: new ol.style.Fill({
        color: 'rgba(255, 153, 0, 0.4)'
      })
    })
})

// var gauges = new ol.layer.Image({
var gauges = new ol.layer.Vector({
    name: 'gauges',
        source: new ol.source.TileVector({
            format: new ol.format.TopoJSON({
                defaultProjection: 'EPSG:3857'
            }),
            projection: 'EPSG:3857',
            tileGrid: ol.tilegrid.createXYZ({
                minZoom: 0,
                maxZoom: 9 
            }),
            url: 'http://localhost:8080/gauges/{z}/{x}/{y}.topojson'
        }),
        style: gauge_style
});



layers.push(stamen, osm, waterways, gauges);

/**
 * Create the OL map with the given layers and interactions
 */
map_ud = new ol.Map({
    renderer: 'canvas',
    layers: [new ol.layer.Group({
        layers: layers
    })],

    target: 'map_ud',
    view: new ol.View({
        center: [847316.1308811717, 6793531.649854118],
        zoom: 6, 
        minZoom: 5
    }),
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: true 
        })
    })
});

map_ud.on('singleclick', function(evt){
    var coord = evt.coordinate;
	var transformed_coordinate = ol.proj.transform(coord, "EPSG:900913", "EPSG:4326");
})

var map_hist = new ol.Map({
    renderer: 'canvas',
    layers: [new ol.layer.Group({
        layers: layers
    })],

    target: 'map_hist',

    view: map_ud.getView(),

    // view: new ol.View({
    //     center: [847316.1308811717, 6793531.649854118],
    //     zoom: 7,
    //     minZoom: 5
    // }),
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: true 
        })
    }), 

});

