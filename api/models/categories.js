(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var categorySchema = new Schema({
		name: String,
		taskIds: [Schema.Types.ObjectId]
	});

	module.exports = categorySchema;
})();
