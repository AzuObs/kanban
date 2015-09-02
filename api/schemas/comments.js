(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var commentSchema = new Schema({
		content: String,
		date: Date,
		worker: {
			type: Schema.Types.ObjectId,
			ref: "Worker"
		}
	});

	module.exports = commentSchema;
})();
