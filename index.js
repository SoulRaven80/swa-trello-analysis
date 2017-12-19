var express = require('express');
var path = require('path');

var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
/*
app.get('/', function(req, res) {
  res.render('index.html');
});
*/
app.listen(app.get('port'));

