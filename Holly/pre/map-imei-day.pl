#!/usr/bin/perl -w

use strict;

my %ocurr;
while (<>) {
    my @data = split /[;]/;
    my $imei = $data[8];
    my $timestamp = $data[-3];
    my $lat = $data[9];
    my $lon = $data[10];
    $ocurr{$imei}{$timestamp} = [$lat,$lon];
    #print "| $imei -> $lat,$lon"
}

foreach my $field (sort keys %ocurr) {
  printf "$field, ";
  foreach my $t (sort keys %{ $ocurr{$field}}) {
    printf "$t, ";
    printf join(', ',@{$ocurr{$field}{$t}});
    printf ", "
  }
printf "\n";
}



