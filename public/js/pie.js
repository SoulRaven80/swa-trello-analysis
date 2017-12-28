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
