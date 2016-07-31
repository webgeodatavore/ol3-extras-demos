var ol = require('openlayers');
var cw = require('catiline');

var geojson_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON()
  })
});

map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    geojson_layer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([3.6656, 45.9192]),
    zoom: 6
  })
});

var wfunc = function(base, cb) {
  importScripts('./node_modules/shpjs/dist/shp.js');
  shp(base).then(cb);
};

var worker = cw({
  data: wfunc
}, 2);

worker.data(cw.makeUrl('data/TM_WORLD_BORDERS_SIMPL-0.3.zip')).then(
  function(data) {
    console.log(data);
    var parser = new ol.format.GeoJSON();
    var features = parser.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
    geojson_layer.getSource().addFeatures(features);
  },
  function(a) {
    console.log(a);
  }
);
