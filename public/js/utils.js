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
