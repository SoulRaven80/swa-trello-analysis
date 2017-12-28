var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

d3.json(getJsonURLforAllCards("closed,name,labels", false), function(error, cards) {
    if (error) throw error;

  var filteredData = countAllCardsPerLabel(cards);
  var maxValue = d3.max(filteredData, function(d) { return d.value; });

  draw(filteredData);

  function draw(data) {
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, maxValue]);

    $("svg").empty();

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .call(wrapFromZeroX, x.bandwidth());

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Value");

    var bar = g.selectAll(".bar").data(data);

    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); });

    d3.selectAll("input").on("change", changed);

    function changed() {
      var filteredData = filterData(cards);
      draw(filteredData);
    }
  }
});

function countOpenCardsPerLabel(cards) {
  var labelsMap = new Map();
  for (i = 0; i < cards.length; i++) {
    if (!cards[i].closed) {
      if (cards[i].labels.length == 0) {
        if (labelsMap.has("N/A")) {
          labelsMap.set("N/A", labelsMap.get("N/A") + 1);
        }
        else {
          labelsMap.set("N/A", 1);
        }
      }
      else {
        for (j = 0; j < cards[i].labels.length; j ++) {
          var cardLabel = cards[i].labels[j].name;
          if (labelsMap.has(cardLabel)) {
            labelsMap.set(cardLabel, labelsMap.get(cardLabel) + 1);
          }
          else {
            labelsMap.set(cardLabel, 1);
          }
        }
      }
    }
  }
  return mapToJson(labelsMap);
}

function wrapFromZeroX(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function filterData(cards) {
  if ($("input[name=cardsMode]:checked").val() == "allCards") {
    return countAllCardsPerLabel(cards);
  }
  else {
    return countOpenCardsPerLabel(cards);
  }
}
