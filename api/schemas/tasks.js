(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var workerSchema = require(process.cwd() + "/schemas/workers.js");

	var taskSchema = new Schema({
		name: String,
		position: Number,
		workers: [workerSchema]
	});

	module.exports = taskSchema;
})();
