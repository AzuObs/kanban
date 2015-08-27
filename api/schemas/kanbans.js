(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var categorySchema = require(process.cwd() + "/schemas/categories.js");
	var workerSchema = require(process.cwd() + "/schemas/workers.js");


	var kanbanSchema = new Schema({
		categories: [categorySchema],
		workers: [workerSchema]
	});

	module.exports = kanbanSchema;
})();
