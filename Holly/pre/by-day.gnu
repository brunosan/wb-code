#!/usr/bin/gnuplot
reset
set terminal png
set datafile separator ","
#set format y "%.1t"
set xdata time
set timefmt '%Y-%m-%d '
set xlabel "day"
set format x "%j"
set title "Data points per day of year"
set key below
set grid
set style line 1 lc rgb '#0060ad' lt 1 lw 2 pt 1 pi -1 ps 0.5
#set pointintervalbox 3

plot "by-day.csv" using 1:2 with linespoints ls 1

