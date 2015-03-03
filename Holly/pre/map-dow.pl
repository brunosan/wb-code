#!/usr/bin/perl -w 

use strict;
use DateTime::Format::Strptime;

my $parser = DateTime::Format::Strptime->new(pattern => '%Y-%m-%d %H:%M:%S');
my $format = DateTime::Format::Strptime->new(pattern => '%w' );
my %ocurr;
while (<>) {
    my $data = (split /[;.]/,$_)[1];
    my $t = $parser->parse_datetime($data); 
    my $field=$format->format_datetime($t); 
    #printf "$_ -> $data -> $t -> $field\n";
    $ocurr{$field} = 0 if (not exists $ocurr{$field});
    $ocurr{$field}++
}

foreach my $field (keys %ocurr) {
    printf "$field $ocurr{$field}\n"; 
}



