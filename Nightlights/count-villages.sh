#!/bin/sh
#Get locations of all viallges in India

#Get India extract
wget "http://download.geofabrik.de/asia/india-latest.osm.pbf" -P ~/tmp/

#import into PSql
createdb gis
psql -d gis -c 'CREATE EXTENSION postgis; CREATE EXTENSION hstore;'
osm2pgsql --create --database gis ~/tmp/india-latest.osm.pbf

#In total there are X nodes
psql -d gis -c "
SELECT count(*) FROM planet_osm_point"
#1 089 417

#Of which X are tagged as cities, villages, ...
psql -d gis -c "
SELECT count(*) FROM planet_osm_point 
WHERE place IN ('town', 'city','locality','village','hamlet', 'isolated_dwelling');"
#40 122

#complete rundown
psql -d gis -c "
Select count(*), place from planet_osm_point group by place order by count(*) desc:"
# count  |         place
#---------+------------------------
# 1044915 |
#   30416 | village
#    3631 | hamlet
#    2913 | town
#    2894 | locality
#    1825 | suburb
#    1759 | neighbourhood
#     334 | county
#     218 | city
#     140 | island
#     108 | yes
#      50 | isolated_dwelling
#      31 | state
#       9 | Hattigudur
