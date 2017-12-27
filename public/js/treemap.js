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

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function resolveColors(colorName) {
  if ($("input[name=colorMode]:checked").val() == "softColors") {
    return color(colorName);
  }
  else {
    return d3.hsl(colorName);
  }
}
