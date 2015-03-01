#!/bin/bash
alias time=/usr/bin/time 
export LC_ALL=C

set -x

echo Our variables: 
folder=~/wb-data/Holly/pre/
data=locationupdate.csv

echo "------Number of dots---------"
echo "size of $data (bytes)"
data_size=`du -b $folder/$data | cut -f1`
echo "size of one line (bytes)"
line_size=`head -2 $folder/$data | tail -1 | wc -c`
echo "quick estimation of lines: `echo $data_size/$line_size | bc` lines."

echo "Counting the real number of lines:"
#time wc -l $folder/$data 
echo "50.004.568  (Takes 3.5 minutes!)"

echo "a better way using all CPU cores (~100 Mb/s but it could be --pipeparted to ~1Gb/s)"
time cat  $folder/$data | parallel --block 10M wc -l | awk '{s+=$1} END {print s}'
echo "1.25 minutes"

#records per hour of the day
time cat ~/wb-data/Holly/pre/locationupdate.csv| parallel --skip-first-line --pipe --blocksize 64M ./map-hour.pl | ./reduce.pl > by-hour.csv &>> /dev/log
./by-hour.gnu >by-hour.png

#records per day
time cat ~/wb-data/Holly/pre/locationupdate.csv| parallel --skip-first-line --pipe --blocksize 64M ./map-day.pl | ./reduce.pl > by-day.csv &>> /dev/log
./by-day.gnu >by-day.png

#records per day of week
time cat ~/wb-data/Holly/pre/locationupdate.csv| parallel --skip-first-line --pipe --blocksize 64M ./map-dow.pl | ./reduce.pl > by-dow.csv &>> /dev/log
./by-dow.gnu >by-dow.png


#records per day and driver

#length in total

# length per IMEI


#on the fly make a json of a dot and calculate heatmap
