var bbox = [ 123.83857727050781, 10.255465437158735,
                 123.98620605468751, 10.395636925175673    ];
L.mapbox.accessToken = 'pk.eyJ1IjoibW9yZ2FuaGVybG9ja2VyIiwiYSI6Ii1zLU4xOWMifQ.FubD68OEerk74AYCLduMZQ';

var map = L.mapbox.map('map', 'examples.map-y7l23tes', 
    {zoomControl: false ,attributionControl: false, infoControl: true})
    .setView([ 10.298367918849806, 123.898315429], 12);
//map.scrollWheelZoom.disable();

var layerGroup = L.layerGroup().addTo(map);

// calculate available months and sort
var months = Object.keys(squaregrid.features[0].properties);
months.shift();
months = months.sort();

var totals = months.map(function(m, i){
    var total = 0;
    squaregrid.features.forEach(function(cell) {
        total+= cell.properties[m];
    });
    return total;
});

var pointgrid = turf.featurecollection([]);
pointgrid.features = squaregrid.features.map(function(cell) {
    var pt = turf.centroid(cell);
    pt.properties = cell.properties;
    return pt;
});

var activeGrid = pointgrid;
var activeGridName = 'heat';
var speeds = {
    'slow': 1000,
    'medium': 500,
    'fast': 100
};
var speed = speeds.fast;

var start = 0;
var stop = months.length-1;
var month = 0;
var i = 0;
setInterval(function() {
    if(i % speed === 0){
        setViz(activeGrid, month.toString());
        month++;
    }    
    if(month >= stop) month = start;
    i+=5;
}, 1);


dow=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function setViz (grid, month) {
    // update month
    drawProgress();
    document.getElementById('month').innerHTML = months[month].split('-')[1]+'h '+dow[months[month].split('-')[0]];
    // filter empty data
    var filtered = turf.featurecollection([]);
    filtered.features = grid.features.filter(function(cell){
        return cell.properties[months[month]];
    });
    // clear old data
    layerGroup.clearLayers();

    if(activeGridName === 'heat') {
        // heatmap on points
        var contour = '#000';
        var heatData = filtered.features.map(function(pt) {
           return [pt.geometry.coordinates[1], pt.geometry.coordinates[0], Math.log(pt.properties[months[month]])/10];
        });

        // deal wih z11 & 12 & 13
        var radius = 4;
        var blur = 1;
        /*if(map._zoom ===11) {
            radius = 15;
            blur = 20;
        }
        if(map._zoom ===12) {
            radius = 30;
            blur = 25;
        }
        if(map._zoom ===13) {
            radius = 40;
            blur = 50;
        }*/

        L.heatLayer(heatData, { 
            maxZoom: 10,
            radius: radius,
            blur: blur,
            max:1,
            gradient: {0:contour,0.1:'#ffeda0',
                0.2:'#ffeda0',0.21:contour,0.22:'#ffeda0',
                0.4:'#ffeda0',0.41:contour,0.42:'#ffeda0',
                0.6:'#feb24c',0.61:contour,0.62:'#feb24c',
                0.8:'#feb24c',0.81:contour,0.82:'#feb24c',
                0.988:'#f03b20',0.989:contour,0.90:'#f03b20',
                0.97:'#f00',0.98:contour,0.99:'#f00',
                1:'#f00'}
            }).addTo(layerGroup);
    } else {
        // poly grid layers
        var prop = month.toString()+'_class';
        filtered.features.forEach(function(cell) {
            cell.properties.fill = '#f00';
            cell.properties['stroke-width'] = 0;
            cell.properties.stroke = '#000';
            cell.properties['stroke-opacity'] = 0;
            cell.properties['fill-opacity'] = (cell.properties[months[month]])/350;
        });

        L.geoJson(filtered, {
            style: L.mapbox.simplestyle.style,
        }).addTo(layerGroup);
    }
}


// set visualization
document.getElementById('heat').onclick = function() { 
    activeGrid = pointgrid;
    activeGridName = 'heat';
    document.getElementById('heat').classList.add('active');
    document.getElementById('square').classList.remove('active');
};
document.getElementById('square').onclick = function() { 
    activeGrid = squaregrid;
    activeGridName = 'square';
    document.getElementById('square').classList.add('active');
    document.getElementById('heat').classList.remove('active');
};

// set speed
document.getElementById('slow').onclick = function() {
    speed = speeds.slow;
    document.getElementById('slow').classList.add('active');
    document.getElementById('medium').classList.remove('active');
    document.getElementById('fast').classList.remove('active');
};
document.getElementById('medium').onclick = function() {
    speed = speeds.medium;
    document.getElementById('slow').classList.remove('active');
    document.getElementById('medium').classList.add('active');
    document.getElementById('fast').classList.remove('active');
};
document.getElementById('fast').onclick = function() {
    speed = speeds.fast;
    document.getElementById('slow').classList.remove('active');
    document.getElementById('medium').classList.remove('active');
    document.getElementById('fast').classList.add('active');
};

drawTime();
window.onresize = drawTime;

function drawTime (){
    var width = window.innerWidth;
    var height = 40;

    // linear scaling
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.pow().exponent(1.2)
        .range([height, 0]);

    // create brush
    var brush = d3.svg.brush()
        .x(x)
        .on('brush', brushmove)
        .on('brushend', brushend);

    var area = d3.svg.area().interpolate('monotone') 
        .x(function(d, i) { return x(i); })
        .y0(height)
        .y1(function(d) { return y(d); });

    document.getElementById('totals').innerHTML = '';
    var svg = d3.select('#totals').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id','tracker')
        .append('g');
        
    x.domain(d3.extent(totals, function(d, i) { return i; }));
    y.domain([0, d3.max(totals, function(d) { return d; })]);
    svg.append('path')
        .datum(totals)
        .attr('class', 'area')
        .attr('d', area);

    // brush logic
    var brushg = svg.append('g')
        .attr('class', 'brush')
        .call(brush);

    var handle = d3.svg.area()
        .x(function(d, i) { return i; })
        .y0(height)
        .y1(0);

    brushg.selectAll('.resize').append('path')
        .attr('d', handle);

    brushg.selectAll('rect')
        .attr('height', height);

    brushstart();
    brushmove();

    // x axis w/ dates
    var ticks = months.filter(function(m){
        if(m.split('/')[1] === '01' ) return m;
    });
    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(months.length)
        .tickFormat(function(d,i){
            if(months[d*1].split('/')[1] === '01') return months[d*1].split('/')[0].slice(2,4);
        })
        .orient('top');
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, 47)')
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -20)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    function brushstart() {
        brush.extent([0,months.length-1]);
    }

    function brushmove() {
        var s = brush.extent();
        start = s[0]*1;
        stop = s[1]*1;
        month = start;
    }

    function brushend() {
        if (!d3.event.sourceEvent) return; // only transition after input
        var extent0 = brush.extent(),
          extent1 = extent0.map(function(val) { return Math.round(val); });

        // if user clicks tracker, set to month clicked
        if (extent1[0] >= extent1[1]) {
            month=extent1[0];
            start=0;
            stop = months.length-1;
        }
        else {
            d3.select(this).transition()
              .call(brush.extent(extent1))
              .call(brush.event);
        }
    }
}

function drawProgress(){
    var width = window.innerWidth;
    document.getElementById('progress').style.width = (month/(months.length-1))*(width)+'px';
}
