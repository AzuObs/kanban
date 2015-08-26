(function() {
	"use strict";

	var mongoose = require("mongoose");
	var staffSchema = new mongoose.Schema({
		name: String,
		profilePictureUrl: String
	});

	module.exports = staffSchema;
})();
