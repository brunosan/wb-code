#!/usr/bin/perl -w

use strict;

my %ocurr;
while (<>) {
    chomp;
    my ($field, $count) = split / /;
    $ocurr{$field} = 0 if (not exists $ocurr{$field});
    $ocurr{$field} += $count;
}

my $total = 0;
foreach my $field (sort keys %ocurr) {
    $total += $ocurr{$field};
    print "$field , $ocurr{$field}\n";
}
