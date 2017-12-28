var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.json(getJsonURLforAllCards("name,labels", false), function(error, cards) {
  if (error) throw error;

  var json = countAllCardsPerLabel(cards);

  var arc = g.selectAll(".arc")
      .data(pie(json))
      .enter().append("g")
        .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.name); });

  // Get the angle on the arc and then rotate by -90 degrees
  var getAngle = function (d) {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
  };

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"
      // uncomment for 90 degrees angle text
      // + "rotate(" + getAngle(d) + ")";
      ; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.name; });
});
