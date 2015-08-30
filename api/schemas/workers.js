(function() {
	"use strict";

	var mongoose = require("mongoose");
	var workerSchema = new mongoose.Schema({
		name: String,
		position: Number,
		pictureUrl: String
	});

	module.exports = workerSchema;
})();
