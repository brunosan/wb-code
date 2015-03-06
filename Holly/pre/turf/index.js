var csv = require('csv-stream');
var fs = require('fs');
var turf = require('turf');

var options = {
    delimiter : ';' 
}

var csvStream = csv.createStream(options);
csvData="/home/brunosan/wb-data/Holly/pre/locationupdate.csv";

var rs = fs.createReadStream(csvData);
pace = require('pace')(50004568);

// pipe data from the csv file so memory usage is kept low
rs.pipe(csvStream);

// create 1/2 mi grid over chicago lon,lat
var bbox = [ 123.83857727050781, 10.255465437158735,
             123.98620605468751, 10.395636925175673    ];
var grid = turf.squareGrid(bbox, 0.5, 'miles');
fs.writeFileSync('grid.geojson', JSON.stringify(grid));
grid.features.forEach(function(cell) {
    // precompute bboxes
    cell.bbox = turf.extent(cell);
    cell.properties.total = 0;
});

var months = {}; //save boolean for the array of months
csvStream.on('data', function (obj) {
    pace.op();
    // check for valid lat, lons
    //console.log(JSON.stringify(obj));
    if(obj['lat'] && obj['lon']) {
        var pt = turf.point([parseFloat(obj['lon']), parseFloat(obj['lat'])]);
        for(var i = 0; i < grid.features.length; i++) {
            if(pt.geometry.coordinates[0] >= grid.features[i].bbox[0] &&
               pt.geometry.coordinates[0] <= grid.features[i].bbox[2] &&
               pt.geometry.coordinates[1] >= grid.features[i].bbox[1] &&
               pt.geometry.coordinates[1] <= grid.features[i].bbox[3] &&
               turf.inside(pt, grid.features[i])) {
                var dateParts = obj['adjustedtimestamp'].split('-');
                var month = dateParts[0]+'/'+dateParts[1];
                months[month] = true;
                if(!grid.features[i].properties[month]) grid.features[i].properties[month] = 0;
                grid.features[i].properties[month]++;
                grid.features[i].properties.total++;
                break;
            }
        }
    }
});

csvStream.on('end', function() {
    months = Object.keys(months);
    // remove cells with no crimes across all months
    grid.features = grid.features.filter(function(cell) {
        if(cell.properties.total > 0) return true;
    });
    // populate undefined months with a 0 value
    grid.features.forEach(function(cell) {
        delete cell.bbox;
        months.forEach(function(month) {
            if(!cell.properties[month]) cell.properties[month] = 0;
        });
    });
    fs.writeFileSync('grid_dates.geojson', JSON.stringify(grid));
    console.log('complete');
});

