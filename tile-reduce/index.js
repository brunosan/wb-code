'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');

var numFeatures = 0;

tileReduce({
  bbox: [-122.05862045288086, 36.93768132842635, -121.97296142578124, 37.00378647456494],
  tiles: [[ 5275, 12755, 15 ]],
  zoom: 15,
  map: path.join(__dirname, '/count.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '/osm.mbtiles'), raw: true}]
})
.on('reduce', function(num) {
  numFeatures += num;
})
.on('end', function() {
  console.log('Features total: %d', numFeatures);
});
