(function($){
  $(function(){

    $('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

function processToken() {
  if (localStorage.getItem('trello_token') == undefined) {
    $('#login_button').css('display', 'block');
    $('#welcome_button').css('display', 'none');
    $('#buttons_row').css('display', 'none');
  }
  else {
    $('#login_button').css('display', 'none');
    $('#welcome_button').css('display', 'block');
    $('#buttons_row').css('display', 'block');
  }
}
