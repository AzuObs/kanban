(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var Category = require(process.cwd() + "/models/categories.js");
	var Task = require(process.cwd() + "/models/tasks.js");
	var Staff = require(process.cwd() + "/models/staff.js");

	var kanbanSchema = new Schema({
		categories: [Category],
		tasks: [Task],
		staff: [Staff]
	});

	module.exports = kanbanSchema;
})();
