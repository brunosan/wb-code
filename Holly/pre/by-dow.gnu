#!/usr/bin/gnuplot
reset
set terminal png
set datafile separator ","
set format y "%.1t"
set xlabel "Day of Week [Sunday -> 0]"
set ylabel "Million dots"
set title "Data points per day of week"
set grid
set style line 1 lc rgb '#0060ad' lt 1 lw 2 pt 7 pi -1 ps 1.5
set pointintervalbox 3

plot "by-dow.csv" using 1:2 with linespoints ls 1 
