function authorizeUser() {
	window.Trello.authorize({
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
