(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;
	var taskSchema = new Schema({
		name: String,
		staffIds: [Schema.Types.ObjectId]
	});

	module.exports = taskSchema;
})();
