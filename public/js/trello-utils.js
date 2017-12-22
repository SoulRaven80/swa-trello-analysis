var loadedBoards = function(boards) {

  $.each(boards, function(index, value) {
    $('#boards')
      .append($("<option></option>")
      .attr("value",value.id)
      .text(value.name));
   });
   $('select').material_select();
};

var loadBoards = function() {
  //Get the users boards
  Trello.get(
    '/members/me/boards/',
    { token : localStorage.getItem('trello_token') },
    loadedBoards,
    function() { console.log("Failed to load boards"); }
  );
};
