var express = require("express");
var logfmt = require("logfmt");
var app = express();
var request = require("request");

var schedule = require("node-schedule");

var global_scores;
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0,59, 1);

request("http://worldcup.kimonolabs.com/api/matches?apikey=ab36d3439df5c4b72882313aff7e15ff", 
	function(err, response, body) {
	var jsonObj = JSON.parse(body);
	for(var i = 0; i < jsonObj.length; i++) {
		request("http://worldcup.kimonolabs.com/api/teams/"+jsonObj[i].homeTeamId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", 
			function(erri, responsei, bodyi) {
 			var teamObj;
			try {
				teamObj = JSON.parse(bodyi);
			} catch(e) {
				teamObj = null;
			}
			if(teamObj != null) {
				for(var j = 0; j < jsonObj.length; j++) {
					if(teamObj.id == jsonObj[j].homeTeamId) {
						jsonObj[j].homeTeamId = teamObj;
					} else if(teamObj.id == jsonObj[j].awayTeamId) {
						jsonObj[j].awayTeamId = teamObj;
					}
				}
				request("http://worldcup.kimonolabs.com/api/players?apikey=ab36d3439df5c4b72882313aff7e15ff&teamId=" + teamObj.id, 
					function(errplayers, responseplayers, bodyplayers) {
						var playersObj;
						try {
							playersObj = JSON.parse(bodyplayers);
						} catch(e) {
							playersObj = null;
						}
						if(playersObj != null) {
							for(var k = 0; k < jsonObj.length; k++) {
								if(playersObj[0].teamId == jsonObj[k].homeTeamId.id) {
									jsonObj[k].homeTeamPlayers = playersObj;
								} else if(playersObj[0].teamId == jsonObj[k].awayTeamId.id) {
									jsonObj[k].awayTeamPlayers = playersObj;
								}
							}
							for(var k = 0; k < playersObj.length; k++) {
								request("http://worldcup.kimonolabs.com/api/clubs/"+playersObj[k].clubId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", 
									function(errclubs, responseclubs, bodyclubs) {
										var clubObj;
										try {
											clubObj = JSON.parse(bodyclubs);
										} catch(e) {
											clubObj = null;
										}
										if(clubObj != null) {
											for(var l = 0; l < playersObj.length; l++) {
												if(playersObj[l].clubId == clubObj.id) {
													playersObj[l].clubInfo = clubObj;
												}
											}
											for(var l = 0; l < jsonObj.length; l++) {
												for(var m = 0; m < playersObj.length; m++) {
													if(playersObj[m].teamId == jsonObj[l].homeTeamId.id) {
														jsonObj[l].homeTeamPlayers = playersObj;
													} else if(playersObj[m].teamId == jsonObj[l].awayTeamId.id) {
														jsonObj[l].awayTeamPlayers = playersObj;
													}
												}
											}
										}
										global_scores = JSON.stringify(jsonObj);									
									});
							}
						}
				});
			}
			
		});
	}
});
schedule.scheduleJob(rule, function() {
	request("http://worldcup.kimonolabs.com/api/matches?apikey=ab36d3439df5c4b72882313aff7e15ff", 
		function(err, response, body) {
		var jsonObj = JSON.parse(body);
		for(var i = 0; i < jsonObj.length; i++) {
			request("http://worldcup.kimonolabs.com/api/teams/"+jsonObj[i].homeTeamId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", 
				function(erri, responsei, bodyi) {
	 			var teamObj;
				try {
					teamObj = JSON.parse(bodyi);
				} catch(e) {
					teamObj = null;
				}
				if(teamObj != null) {
					for(var j = 0; j < jsonObj.length; j++) {
						if(teamObj.id == jsonObj[j].homeTeamId) {
							jsonObj[j].homeTeamId = teamObj;
						} else if(teamObj.id == jsonObj[j].awayTeamId) {
							jsonObj[j].awayTeamId = teamObj;
						}
					}
					request("http://worldcup.kimonolabs.com/api/players?apikey=ab36d3439df5c4b72882313aff7e15ff&teamId=" + teamObj.id, 
						function(errplayers, responseplayers, bodyplayers) {
							var playersObj;
							try {
								playersObj = JSON.parse(bodyplayers);
							} catch(e) {
								playersObj = null;
							}
							if(playersObj != null) {
								for(var k = 0; k < jsonObj.length; k++) {
									if(playersObj[0].teamId == jsonObj[k].homeTeamId.id) {
										jsonObj[k].homeTeamPlayers = playersObj;
									} else if(playersObj[0].teamId == jsonObj[k].awayTeamId.id) {
										jsonObj[k].awayTeamPlayers = playersObj;
									}
								}
								for(var k = 0; k < playersObj.length; k++) {
									request("http://worldcup.kimonolabs.com/api/clubs/"+playersObj[k].clubId+"?apikey=ab36d3439df5c4b72882313aff7e15ff", 
										function(errclubs, responseclubs, bodyclubs) {
											var clubObj;
											try {
												clubObj = JSON.parse(bodyclubs);
											} catch(e) {
												clubObj = null;
											}
											if(clubObj != null) {
												for(var l = 0; l < playersObj.length; l++) {
													if(playersObj[l].clubId == clubObj.id) {
														playersObj[l].clubInfo = clubObj;
													}
												}
												for(var l = 0; l < jsonObj.length; l++) {
													for(var m = 0; m < playersObj.length; m++) {
														if(playersObj[m].teamId == jsonObj[l].homeTeamId.id) {
															jsonObj[l].homeTeamPlayers = playersObj;
														} else if(playersObj[m].teamId == jsonObj[l].awayTeamId.id) {
															jsonObj[l].awayTeamPlayers = playersObj;
														}
													}
												}
											}
											global_scores = JSON.stringify(jsonObj);									
										});
								}
							}
					});
				}

			});
		}
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
