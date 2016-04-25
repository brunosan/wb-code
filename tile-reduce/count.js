'use strict';

module.exports = function tile_distance(tile){
  /* Given a tile with roads, find the average distance
  of any point within the tile to the closest road */
  var distance = -1;

  TODO average distance

  return distance;
}

module.exports = function tiles_center_distance(tile1,tile2){
  /* Given 2 tiles zxy, find the distance between the centers.
  */
  var distance = -1;

  TODO lat1 lat2 lon1 lon2 distance.

  return distance;
}

module.exports = function(data, tile, writeData, done) {
  var distance = 0;

  console.log(JSON.stringify(data.osm.roads));
  if (data.osm.roads) count += data.osm.roads.length;

  if (data.osm.roads){
    //Find internal average distance if there are roads inside.
    return tile_distance(tile);
  } else {
    /*Find distance to closest tile with roads, and find average distance,
    then sum centroid distance*/
    for neighbour in ring_with_roads:
      
  }


  done(null, distance);
};
