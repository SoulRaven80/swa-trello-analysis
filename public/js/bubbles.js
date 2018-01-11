var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");
var format = d3.format(",d");
var color = d3.scaleOrdinal(d3.schemeCategory20c);
var pack = d3.pack()
  .size([width - 4, height - 4]);
var radius = d3.scaleSqrt()
    .range([0, 10]);

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
    .attr("class", "tooltip")
    .text("tooltip");
});

function getMembersFromCards(cards) {
  var membersMap = new Map();
  var noAssignees = "No Assignees";
  for (i = 0; i < cards.length; i++) {
    if (cards[i].members.length == 0) {
      addMemberToMap(membersMap, noAssignees);
    }
    else {
      for (j = 0; j < cards[i].members.length; j ++) {
        addMemberToMap(membersMap, cards[i].members[j].fullName);
      }
    }
  }
  return mapToJson(membersMap);
}

function addMemberToMap(map, member) {
  if (map.has(member)) {
    map.set(member, map.get(member) + 1);
  }
  else {
    map.set(member, 1);
  }
}
