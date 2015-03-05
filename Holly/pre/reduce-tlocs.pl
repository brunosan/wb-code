#!/usr/bin/perl -w

use strict;

my %ocurr;
while (<>) {
    chomp;
    my @list = split /,/;
    my $imei=$list[0];
    splice @list 1;
    printf @list,"\n"; 
    #for (substr @list 1)-> $time, $lat, $lon {
    #say "$time, $lat, $lon";
	    #}
    #($field, $count) = split / /;
    #$ocurr{$field} = 0 if (not exists $ocurr{$field});
    #$ocurr{$field} += $count;
}

printf "end";
my $total = 0;
foreach my $field (sort keys %ocurr) {
    $total += $ocurr{$field};
    print "$field , $ocurr{$field}\n";
}
