var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };
var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
var format = d3.format(",d");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .padding(1);

d3.json(getJsonURLforAllCards("name,labels", false), function(error, cards) {
  if (error) throw error;

  var json = groupLabelsFromCards(cards);

  var root = d3.hierarchy(json)
    .sum(function(d) { return d.children ? 0 : 1; });

  treemap(root);

  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .style("stroke", "rgb(120,120,120)")
      .style("stroke-width", "0.5")
      .style("fill", function(d) { return resolveColors(d.parent.data.color); })
      .on("mouseover", function(d) {
              tooltip.text(d.data.name);
              tooltip.style("visibility", "visible");
      })
      .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .text("tooltip");

  var cellWidth;
  cell.append("text")
      .attr("x", function(d) {
        cellWidth = (d.x1 - d.x0) / 2;
        return cellWidth; })
      .attr("y", function(d) { return ((d.y1 - d.y0) / 2) - 20; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.parent.data.name; })
      .call(wrap, cellWidth);

  d3.selectAll("input").on("change", changed);

  function changed() {
    treemap(root);
    cell.transition()
      .duration(750)
      .select("rect")
      .style("fill", function(d) { return resolveColors(d.parent.data.color); });
  }
});

function groupLabelsFromCards(cards) {
  var jsonObj = [];
  var root = {}
  root.name = "root";
  root.children = jsonObj;
  for (i = 0; i < cards.length; i++) {
    var label;
    var color;
    if (cards[i].labels.length == 0) {
      label = "N/A";
      color = "white";
      process(jsonObj, label, color, cards[i]);
    }
    else {
      for (j = 0; j < cards[i].labels.length; j ++) {
        label = cards[i].labels[j].name;
        color = cards[i].labels[j].color;
        process(jsonObj, label, color, cards[i]);
      }
    }
  }
  return root;
}

function arrayIncludesName(array, name) {
  for (k = 0; k < array.length; k++) {
    if (array[k].name == name) {
      return k;
    }
  }
  return -1;
}

function process(jsonObj, label, color, card) {
  var index = arrayIncludesName(jsonObj, label);
  if (index == -1) {
    var obj = {};
    obj.name = label;
    obj.color = color;
    obj.children = [card];
    jsonObj[(jsonObj.length ? jsonObj.length : 0)] = obj;
  }
  else {
    jsonObj[index].children.push(card);
  }
}

function resolveColors(colorName) {
  if ($("input[name=colorMode]:checked").val() == "softColors") {
    return color(colorName);
  }
  else {
    return d3.hsl(colorName);
  }
}
