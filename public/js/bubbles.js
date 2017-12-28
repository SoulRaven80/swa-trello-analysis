var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");
var format = d3.format(",d");
var color = d3.scaleOrdinal(d3.schemeCategory20c);
var pack = d3.pack()
  .size([width - 4, height - 4]);
var radius = d3.scaleSqrt()
    .range([0, 15]);

d3.json(getJsonURLforAllCards("members", true), function(error, cards) {
  if (error) throw error;

  var members = getMembersFromCards(cards);
  var root = d3.hierarchy({children: members})
    .sum(function(d) { return d.value; });

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
    .attr("id", function(d) { return d.data.name; })
    .attr("r", function(d) { return radius(d.data.value == undefined ? 1 : d.data.value * 10); })
    .style("fill", function(d) { return color(d.data.name); })
    .on("mouseover", function(d) {
            tooltip.text(format(d.value));
            tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  node.append("text")
    .text(function(d) { return d.data.name; });

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");
});

function getMembersFromCards(cards) {
  var membersMap = new Map();

  for (i = 0; i < cards.length; i++) {
    for (j = 0; j < cards[i].members.length; j ++) {
      var cardMember = cards[i].members[j].fullName;
      if (membersMap.has(cardMember)) {
        membersMap.set(cardMember, membersMap.get(cardMember) + 1);
      }
      else {
        membersMap.set(cardMember, 1);
      }
    }
  }
  return mapToJson(membersMap);
}
