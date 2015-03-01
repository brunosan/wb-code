#!/usr/bin/perl -w

use strict;
use Time::Piece; 

my %ocurr;
while (<>) {
    my @data = split /[;]/;
    #my $t = Time::Piece->strptime($data[-3],"%Y-%m-%d %H:%M:%S");
    #my $field=$t->strftime("%H");
    my $field = (split /[\s:]/,$data[-3])[0];
    #$field =~ s/\s/_/g;
    $ocurr{$field} = 0 if (not exists $ocurr{$field});
    $ocurr{$field}++
}

foreach my $field (keys %ocurr) {
    printf "$field $ocurr{$field}\n";
}



