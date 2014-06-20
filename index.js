var express = require("express");
var logfmt = require("logfmt");
var app = express();
var request = require("request");

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  request("http://worldcup.kimonolabs.com/api/matches?apikey=ab36d3439df5c4b72882313aff7e15ff", function(err, response, body) {
  res.send(response);
 });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
