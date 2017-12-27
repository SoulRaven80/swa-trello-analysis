function authorizeUser() {
  Trello.authorize({
    type: 'popup',
    name: 'Trello analysis dashboard',
    persist: 'true',
    scope: {
      read: 'true',
      write: 'true' },
      expiration: 'never',
      success: authenticationSuccess,
      error: authenticationFailure
    });
}

var authenticationSuccess = function(param) {
  console.log('Successful authentication');
  processToken();
};

var authenticationFailure = function(param) {
  console.log('Failed authentication');
  processToken();
};

function getLoggedInfo(onSuccess, onError) {
  Trello.get('members/me',
    { token : localStorage.getItem('trello_token') },
    onSuccess,
    onError
  );
}

function processToken() {
  if (localStorage.getItem('trello_token') == undefined) {
    $('#login_button').css('display', 'block');
    $('#welcome_button').css('display', 'none');
    $('#buttons_row').css('display', 'none');
    $('#board_selection').css('display', 'none');
  }
  else {
    $('#login_button').css('display', 'none');
    $('#welcome_button').css('display', 'block');
    $('#buttons_row').css('display', 'block');
    $('#board_selection').css('display', 'block');

    // show logged user info
    getLoggedInfo(
      function(result) {
        $('#welcome_button').text("Welcome " + result.fullName + "!");
      },
      function (result) {
        console.log(result)
      });
      $("#welcome_button").dropdown();

    // load boards
    loadBoards();
  }
}

function logout() {
  localStorage.removeItem('trello_token');
  localStorage.removeItem('boardId');
  window.location = '/';
}
