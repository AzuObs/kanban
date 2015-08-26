var express = require("express"),
	mongoose = require("mongoose"),
	router = require(process.cwd() + "/routes/router.js");

var app = express();
router.createRoutes(app);

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/kanban:27017");
var db = mongoose.connection;
db.on("error", function(err) {
	console.log("mongoose didn't connect: " + err);
});

app.listen(process.env.PORT || 8000);

process.on("uncaughtException", function(err) {
	console.log(err);
});
