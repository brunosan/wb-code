#!/usr/bin/gnuplot
reset
set terminal png
set datafile separator ","
set format y "%.1t"
set xlabel "Hour of day"
set ylabel "Millions of dots"
set title "Data points per hour of day"
set grid
set style line 1 lc rgb '#0060ad' lt 1 lw 2 pt 7 pi -1 ps 1.5
set pointintervalbox 3

plot "by-hour.csv" using 1:2 with linespoints ls 1

