var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

/*
app.get('/', function(request, response) {
  response.send('Hellhoh!');
});
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('./phantomjs');
var binPath = phantomjs.path;
 
var childArgs = [
  path.join(__dirname, './phantomjs/mobilead/svgSave.js'),
  '05' //arguments
];
 
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results 
});