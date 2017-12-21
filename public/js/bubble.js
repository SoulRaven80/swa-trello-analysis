function mapToJson(map) {
  var result = new Array();
  var cont = 0;
  for (let [k,v] of map) {
    result[cont++] = {"name":k, "value":v};
  }
  return JSON.parse(JSON.stringify(result));
}

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
