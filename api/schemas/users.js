(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var boardScham = require(process.cwd() + "/schemas/boards.js");
	var userSchema = new Schema({
		account: String,
		password: String,
		boards: [boardSchema]
	});

	module.exports = userSchema;

})();
