(function() {
	"use strict";

	var mongoose = require("mongoose"),
		Schema = mongoose.Schema;

	var TaskSchema = new Schema({
		content: {
			type: String,
			required: true
		}
	});

	module.exports = mongoose.model("Task", TaskSchema);
})();
