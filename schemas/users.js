(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var boardSchema = require(process.cwd() + "/schemas/boards.js");

	var userSchema = new Schema({
		username: String,
		pwd: String,
		boards: [boardSchema]
	});

	module.exports = userSchema;

})();
