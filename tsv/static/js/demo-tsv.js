    // Assign path to url for the TSV file
    var url = 'static/data/sample-geo.tsv';

    // Initialize an empty vector layer with a vector source and a GeoJSON format
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON()
      })
    });

    // Declare the map with a tile layer, the empty vector layer and set it center
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      target: 'map',
      view: new ol.View({
        center: ol.proj.transform([2, 47], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6
      })
    });

    // Initialize a XMLHttpRequest object to prepare for Ajax request
    // (we do not try to catch error)
    var httpRequest = new XMLHttpRequest();

    // Assign function to manage when data will be loaded via Ajax
    httpRequest.onreadystatechange = function(data) {
      // If request not complete
      if (httpRequest.readyState != 4 || httpRequest.status != 200) {
        return;
      } else {
        // Response from TSV will be reused to provide to the library
        // https://github.com/mapbox/csv2geojson the required content
        // to transform it to GeoJSON
        csv2geojson.csv2geojson(httpRequest.responseText, {
          latfield: 'Latitude',
          lonfield: 'Longitude',
          delimiter: '\t'
        }, function(err, data) {
          // After data reception, add features to the empty vector layer
          var geoJsonFormat = new ol.format.GeoJSON();
          var features = geoJsonFormat.readFeatures(
            data, {
              featureProjection: 'EPSG:3857'
            }
          );
          vectorLayer.getSource().addFeatures(features);
        });
      }
    };

    // Set the url for the Ajax call
    httpRequest.open('GET', url);
    // Make the ajax call. It will fire previous onreadystatechange 
    // after data reception from the file
    httpRequest.send();