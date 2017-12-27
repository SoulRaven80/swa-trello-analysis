var loadedBoards = function(boards) {

  var boardId = localStorage.getItem("boardId");
  $.each(boards, function(index, value) {
    if (value.id == boardId) {
      var option = $('#boards')
        .append($("<option></option>")
        .attr("value", value.id)
        .attr("selected", "selected")
        .text(value.name));
    }
    else {
      var option = $('#boards')
        .append($("<option></option>")
        .attr("value",value.id)
        .text(value.name));
    }
   });
   $('select').material_select();
};

var loadBoards = function() {
  //Get the users boards
  Trello.get(
    '/members/me/boards/',
    { token : localStorage.getItem('trello_token'), filter: "open" },
    loadedBoards,
    function() { console.log("Failed to load boards"); }
  );
};
