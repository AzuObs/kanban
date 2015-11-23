(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var workerSchema = require(process.cwd() + "/schemas/workers.js");
	var commentSchema = require(process.cwd() + "/schemas/comments.js");

	var taskSchema = new Schema({
		name: String,
		position: Number,
		workers: [{
			type: Schema.Types.ObjectId,
			ref: "Worker"
		}],
		comments: [commentSchema]
	});

	module.exports = taskSchema;
})();
