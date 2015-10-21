      // Declare worker scripts path for zip manipulation
      zip.workerScriptsPath = 'static/js/';

      // Declare layer
      vector = new ol.layer.Vector({
        source: new ol.source.Vector({
          format: new ol.format.KML({
            extractStyles: true
          })
        })
      });

      // Declare map and add MapQuest layer and KML layer
      var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.MapQuest({
              layer: 'sat'
            })
          }),
          vector
        ],
        view: new ol.View({
          center: ol.proj.transform(
            [-98.579416, 39.828328],
            'EPSG:4326',
            'EPSG:3857'
          ),
          zoom: 4
        })
      });

      // Url to KMZ file (in fact, it's a kml zipped file and not a gzipped file)
      var url = 'http://www.spc.noaa.gov/products/watch/ActiveWW.kmz';
      // var url = '/proxy/www.spc.noaa.gov/products/watch/ActiveWW.kmz';
      
      // Function to ease KML feature reading
      function addFeatures(text) {
        var formatter = new ol.format.KML();
        var kml_features = formatter.readFeatures(text, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        vector.getSource().addFeatures(kml_features);
      }

      // Function to parse KML text to get link reference to other KMZ
      function parseKmlText(text) {
          var oParser = new DOMParser();
          var oDOM = oParser.parseFromString(text, 'text/xml');
          var links = oDOM.querySelectorAll('NetworkLink Link href');
          var files = Array.prototype.slice.call(links).map(function(el) {
            return el.textContent;//.replace('http://', '/proxy/');
          });
          // console.log(files);
          return files;
      }
      
      // Function to unzip content from blob and execute callback on
      // first entry (not generic but assumed for the demo)
      function unzipFromBlob(callback) {
        return function unzip(blob) {
          // use a BlobReader to read the zip from a Blob object
          zip.createReader(new zip.BlobReader(blob), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
              if (entries.length) {
                // get first entry content as text
                entries[0].getData(new zip.TextWriter(), function(text) {
                  // text contains the entry data as a String
                  console.log(text);
                  callback(text);
                  // close the zip reader
                  reader.close(function() {
                    // onclose callback
                  });

                }, function(current, total) {
                  // onprogress callback
                });
              }
            });
          }, function(error) {
            // onerror callback
          });
        };
      }

      // Function to make ajax call and make a callback on success
      function ajaxKMZ(url, callback) {
        qwest.get(url, null, {
          responseType: 'blob'
        })
        .then(function(response) {
          // Run when the request is successful
          callback(response);
        })
        .catch(function(e, url) {
          // Process the error
        })
        .complete(function() {
          // Always run
        });
      }

      // Read reference to other KMZ and add them to the vector layer
      var readAndAddFeatures = function(text) {
        var listFilesKMZ = parseKmlText(text);
        console.log(listFilesKMZ);
        listFilesKMZ.forEach(function(el) {
          // console.log(el);
          // Nested calls. Acceptable for a demo
          // but could be "promisified" instead
          ajaxKMZ(el, unzipFromBlob(addFeatures));
        });
      };


      function repeat_kmz_calls(){
          var combinedCallback = unzipFromBlob(readAndAddFeatures);
          // make the ajax call to kmz that unzip and read the file
          // this file reference other KMZ so we call each of them
          // and add their content
          ajaxKMZ(url, combinedCallback);
          setTimeout(repeat_kmz_calls, 60000);
      }
      repeat_kmz_calls();

      