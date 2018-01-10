//  data stores
var graph;
var store;

//  svg selection and sizing
var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");
var radius = 10;
var paddingLeftRight = 18; // adjust the padding values depending on font and font size
var paddingTopBottom = 12;
var chartMode = 'circle';

//  d3 color scales
var color = d3.scaleOrdinal(d3.schemeCategory10);

var link;
var node;
var text;

//  force simulation initialization
var simulation = d3.forceSimulation()
  .force("link", d3.forceLink()
    .id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody()
    .strength(function(d) { return -1500;}))
  .force("center", d3.forceCenter(width / 2, height / 2));

//  filtered types
typeFilterList = [];

//  filter button event handlers
$(".filter-btn").on("click", function() {
  var id = $(this).attr("value");
  if (typeFilterList.includes(id)) {
    typeFilterList.splice(typeFilterList.indexOf(id), 1)
  } else {
    typeFilterList.push(id);
  }
  filter();
  update();
});

d3.json(getJsonURLforAllCards("name,labels", false), function(error, data) {
  if (error) throw error;

  var g = {}
  g.nodes = getNodesFromCards(data);
  g.links = getLinksFromCards(data);

  var nodeByID = {};

  g.nodes.forEach(function(n) {
    nodeByID[n.id] = n;
  });

  g.links.forEach(function(l) {
    l.sourceGroup = nodeByID[l.source].name.toString();
    l.targetGroup = nodeByID[l.target].name.toString();
  });

  graph = g;
  store = $.extend(true, {}, g);

  update();

  d3.selectAll("input").on("change", changed);

  function changed() {
    chartMode = evalChartMode();
    $("svg").empty();
    update();
  }
});

function evalChartMode() {
  if ($("input[name=chartMode]:checked").val() == "roundNodes") {
    return "circle";
  }
  else {
    return "rect";
  }
}

function getNode(node) {
  if (chartMode == 'circle') {
    return node.enter().append("circle")
      .attr("class", "node")
      .attr("r", radius)
      .attr("fill", function(d) { return color(d.color); })
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
      );
  }
  else {
    return node.enter().append("rect")
      .attr("class", "node")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", function(d) { return color(d.color); })
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
      );
  }
}

function setNodeLocation(node) {
  if (chartMode == 'circle') {
    node
      .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
  }
  else {
    node
      .attr("x", function(d) { return d.x - d.bb.width/2 - paddingLeftRight/2; })
      .attr("y", function(d) { return d.y - d.bb.height;  })
      .attr("width", function(d) { return d.bb.width + paddingLeftRight; })
      .attr("height", function(d) { return d.bb.height + paddingTopBottom; });
  }
}

function setTextLocation(text) {
  if (chartMode == 'circle') {
    text
      .attr("dx", function(d) { return d.x; })
      .attr("dy", function(d) { return d.y - radius - 5; });
  }
  else {
    text
      .attr("dx", function(d) { return d.x; })
      .attr("dy", function(d) { return d.y + (paddingTopBottom / 4); });
  }
}

//  general update pattern for updating the graph
function update() {

  link = svg.append("g").selectAll(".link");
  node = svg.append("g").selectAll(".node");

  //  UPDATE
  node = node.data(graph.nodes, function(d) { return d.id; });

  //  EXIT
  node.exit().remove();

  //  ENTER
  var newNode = getNode(node)

    text = svg.append("g")
      .attr("class", "labels")
      .selectAll("text").data(graph.nodes)
      .enter().append("text")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name });

    newNode.append("title")
      .text(function(d) { return "name: " + d.name + "\n" + "id: " + d.id; });

  //  ENTER + UPDATE
  node = node.merge(newNode);

  //  UPDATE
  link = link.data(graph.links, function(d) { return d.id; });

  //  EXIT
  link.exit().remove();

  //  ENTER
  newLink = link.enter().append("line")
    .attr("class", "link");

  newLink.append("title")
      .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target; });

  //  ENTER + UPDATE
  link = link.merge(newLink);

  //  update simulation nodes, links, and alpha
  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    simulation.alpha(1).alphaTarget(0).restart();

    svg.selectAll("text").each(function(d, i) {
        d.bb = this.getBBox(); // get bounding box of text field and store it in texts array
    });
}

//  drag event handlers
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//  tick event handler with bounded box
function ticked() {
  setNodeLocation(node);

  link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  setTextLocation(text);
}

//  filter function
function filter() {
  //  add and remove nodes from data based on type filters
  store.nodes.forEach(function(n) {
    if (!typeFilterList.includes(n.name) && n.filtered) {
      n.filtered = false;
      graph.nodes.push($.extend(true, {}, n));
    } else if (typeFilterList.includes(n.name) && !n.filtered) {
      n.filtered = true;
      graph.nodes.forEach(function(d, i) {
        if (n.id === d.id) {
          graph.nodes.splice(i, 1);
        }
      });
    }
  });

  //  add and remove links from data based on availability of nodes
  store.links.forEach(function(l) {
    if (!(typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && l.filtered) {
      l.filtered = false;
      graph.links.push($.extend(true, {}, l));
    } else if ((typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && !l.filtered) {
      l.filtered = true;
      graph.links.forEach(function(d, i) {
        if (l.id === d.id) {
          graph.links.splice(i, 1);
        }
      });
    }
  });
}

function getLinksFromCards(cards) {
  var links = [];
  var count = 0;

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].labels.length > 0) {
      for (var j = 0; j < cards[i].labels.length; j++) {
        // first try to link root node to labels
        var obj = {};
        obj.source = -1;
        obj.target = cards[i].labels[j].id;
        if (existLinkInArray(links, obj.source, obj.target) == -1) {
          obj.id = count++;
          links[(links.length ? links.length : 0)] = obj;
        }
      }
    }
    else {
      // link root node to blank label
      var obj = {};
      obj.source = -1;
      obj.target = 0;
      if (existLinkInArray(links, obj.source, obj.target) == -1) {
        obj.id = count++;
        links[(links.length ? links.length : 0)] = obj;
      }
    }

    // now try to link labels among each other
    if (cards[i].labels.length > 1) {
      for (var j = 0; j < cards[i].labels.length-1; j++) {
        for (var k = j+1; k < cards[i].labels.length; k++) {
          var obj = {};
          obj.source = cards[i].labels[j].id;
          obj.target = cards[i].labels[k].id;
          if (existLinkInArray(links, obj.source, obj.target) == -1) {
            obj.id = count++;
            links[(links.length ? links.length : 0)] = obj;
          }
        }
      }
    }
  }
  return links;
}

function existLinkInArray(array, source, target) {
  for (var k = 0; k < array.length; k++) {
    if (array[k].source == source && array[k].target == target) {
      return k;
    }
  }
  return -1;
}

function getNodesFromCards(cards) {
  var nodes = [];
  // adding root object
  var obj = {};
  obj.id = -1;
  obj.name = getBoardName();
  obj.color = 'blue';
  nodes[(nodes.length ? nodes.length : 0)] = obj;

  for (var i = 0; i < cards.length; i++) {
    var id;
    var label;
    var color;
    if (cards[i].labels.length == 0) {
      id = 0;
      label = "N/A";
      color = "white";
      process(nodes, id, label, color, cards[i]);
    }
    else {
      var j;
      for (j = 0; j < cards[i].labels.length; j ++) {
        id = cards[i].labels[j].id;
        label = cards[i].labels[j].name;
        color = cards[i].labels[j].color;
        process(nodes, id, label, color, cards[i]);
      }
    }
  }
  return nodes;
}

function process(nodes, id, label, color, card) {
  var index = arrayIncludesName(nodes, label);
  if (index == -1) {
    var obj = {};
    obj.id = id;
    obj.name = label;
    obj.color = color;
    nodes[(nodes.length ? nodes.length : 0)] = obj;
  }
}

function arrayIncludesName(array, name) {
  for (var k = 0; k < array.length; k++) {
    if (array[k].name == name) {
      return k;
    }
  }
  return -1;
}
