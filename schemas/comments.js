(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var commentSchema = new Schema({
		content: String,
		date: Date,
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	});

	module.exports = commentSchema;
})();
