function getBoardId() {
  var boardId = localStorage.getItem("boardId");
  if (boardId == undefined || boardId == "undefined") {
    // default to SWA Dallas ET
    boardId = "59b1586d844575c1675e5413";
  }
  return boardId;
}

function getJsonURLforAllCardsNoMembers(fields) {
  return "https://api.trello.com/1/boards/" + getBoardId() + "/cards/all/?"
    + "key=870c6e671ccf7a24104558904ab7795c"
    + "&token=" + localStorage.getItem("trello_token")
    + "&fields=" + fields;
}

function getJsonURLforAllCards(fields, showMembers) {
  if (showMembers) {
    return getJsonURLforAllCardsNoMembers(fields) + "&members=true";
  }
  return getJsonURLforAllCardsNoMembers(fields);
}

function mapToJson(map) {
  var result = new Array();
  var cont = 0;
  for (let [k,v] of map) {
    result[cont++] = {"name":k, "value":v};
  }
  var jsonObj = JSON.parse(JSON.stringify(result));
  jsonObj.sort(function (a, b) {
    if (a.name == "N/A") {
      return -1;
    }
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
  });

  return jsonObj;
}

function countAllCardsPerLabel(cards) {
  var labelsMap = new Map();
  for (i = 0; i < cards.length; i++) {
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
  return mapToJson(labelsMap);
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
