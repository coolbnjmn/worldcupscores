var express = require("express");
var logfmt = require("logfmt");
var app = express();
var request = require("request");

var schedule = require("node-schedule");

var global_scores;
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0,59, 1);

request("http://worldcup.kimonolabs.com/api/matches?apikey=ab36d3439df5c4b72882313aff7e15ff", function(err, response, body) {
	var jsonObj = JSON.parse(body);
	for(var i = 0; i < jsonObj.length; i++) {
		request("http://worldcup.kimonolabs.com/api/teams/"+jsonObj[i].homeTeamId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", function(erri, responsei, bodyi) {
			var teamObj = JSON.parse(bodyi);
			for(var j = 0; j < jsonObj.length; j++) {
				if(teamObj.id == jsonObj[j].homeTeamId) {
					jsonObj[j].homeTeamId = teamObj;
				} else if(teamObj.id == jsonObj[j].awayTeamId) {
					jsonObj[j].awayTeamId = teamObj;
				}
			}
			global_scores = JSON.stringify(jsonObj);
		});
	}
	// global_scores = response;
});
schedule.scheduleJob(rule, function() {
	request("http://worldcup.kimonolabs.com/api/matches?apikey=ab36d3439df5c4b72882313aff7e15ff", function(err, response, body) {
		var jsonObj = JSON.parse(body);
		for(var i = 0; i < jsonObj.length; i++) {
			request("http://worldcup.kimonolabs.com/api/teams/"+jsonObj[i].homeTeamId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", function(erri, responsei, bodyi) {
				var teamObj = JSON.parse(bodyi);
				for(var j = 0; j < jsonObj.length; j++) {
					if(teamObj.id == jsonObj[j].homeTeamId) {
						jsonObj[j].homeTeamId = teamObj;
					} else if(teamObj.id == jsonObj[j].awayTeamId) {
						jsonObj[j].awayTeamId = teamObj;
					}
				}
				global_scores = JSON.stringify(jsonObj);
			});
		}
		// global_scores = response;
	});
});
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
	res.send(global_scores);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
