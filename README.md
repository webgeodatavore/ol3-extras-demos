# ol3-extras-demos

Demos for playing with OpenLayers 3 when features not documented because not required in the core

* [KMZ demo](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/kmz/demo-kmz.html) 
  **Warning**: The demo depends from alerts provided by NOAA National Weather Service at their Storm prediction center, so display can be empty but you can always look at the console)
  The demo uses two libraries e.g [zip.js](https://gildas-lormeau.github.io/zip.js/) for unzipping KMZ and [Qwest](https://github.com/pyrsmk/qwest),  an "Ajax library with XHR2, promises and request limit"

* [TSV demo](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/tsv/demo-tsv.html)
  The demo loads a TSV (Tab-separated Values) file and transforms it to GeoJSON using [csv2geojson](https://github.com/mapbox/csv2geojson) as GeoJSON is supported within OpenLayers 3.

* [Nominatim autocomplete demo](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/nominatim-autocomplete/demo-nominatim.html)
  Nominatim is a service provided by OpenStreetMap to geocode and reverse geocode data (associate addresses to coordinates and associate coordinates to addresses).
  The demo uses [Pixabay JavaScript-autoComplete](https://github.com/Pixabay/JavaScript-autoComplete) a pure JavaScript autocomplete library (no framework dependency).
  If you want a standalone library for OpenLayers 3 to existing geocoding services, you can look at [ol3-geocoder](https://github.com/jonataswalker/ol3-geocoder) and [ol3-photon](https://github.com/webgeodatavore/ol3-photon)(we authored it for using the French Geocoder [Addok](https://github.com/etalab/addok) who use the same API signatures as Photon)

* [French GeoAPI autocomplete demo](http://rawgit.com/webgeodatavore/ol3-extras-demos/master/french-geoapi-autocomplete/demo-french-geoapi.html)
  The GeoAPI is a geo-related webservice provided by the French state to be able to search per city, postal code, french unique identifier and location. We just want to demonstrate how to consume it in the browser, associated with a map. You can custom the behavior in the code by playing a bit with options referenced at [the official documentation](https://docs.geo.api.gouv.fr/)

* [Shapefile loading](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/load_from_shapefile/index.html). Just a readaptation of the sample from [shapefile-js](https://github.com/calvinmetcalf/shapefile-js)

* [Select by polygon, circle, square and rectangle](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/select-jsts/select-advanced.html). We manage selection combining `ol.interaction.Draw` with `ol.interaction.Select`.

* [OSRM V5 API consumption](https://rawgit.com/webgeodatavore/ol3-extras-demos/master/osrm-routing/routing-osrm.html)
  The demo enables to draw two points and from these both coordinates calls the OSRM demo endpoint to get the shortest path.


Fill an issue for bug or any improvements.
If you have any other questions, feel free to contact us at contact(at)webgeodatavore(dot)com otherwise.