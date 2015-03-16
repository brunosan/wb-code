#!/bin/bash
# Anonimyze the Cebu data droppping all columns but the lat,lon, and timestamp.

data=~/wb-data/Holly/pre/locationupdate.csv
out=~/wb-data/Holly/pre/latlondate.csv

rm $out
touch $out
awkbody='{print $10 "," $11 ", " $2}'
cat $data | parallel --block 10M --pipe "awk -F\; '$awkbody'" >> $out 

