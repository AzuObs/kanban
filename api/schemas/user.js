(function() {
	"use strict";

	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		account: String,
		password: String,
		kanbans: [Schema.Types.ObjectId]
	});

	module.exports = userSchema;

})();


// All in One Doc
var userSchema = new Schema({
	accName: String,
	pwd: String,
	boards: [{
		workers: [{
			name: String,
			pictureUrl: String
		}],
		categories: [{
			name: String,
			position: Number,
			tasks: [{
				name: String,
				position: Number,
				workers: [{
					name: String,
					pictureUrl: String
				}]
			}]
		}]
	}]
});

// 
var userSchema = new Schema({
	accName: String,
	pwd: String,
	boards: [boardSchema]
});

var boardSchema = new Schema({
	name: String,
	workers: [workerSchema],
	categories: [categorySchema]
});

var categorySchema = new Schema({
	name: String,
	position: Number,
	tasks: [taskSchema]
});

var taskSchema = new Schema({
	name: String,
	position: Number,
	workers: [workerSchema]
});

var workerSchema = new Schema({
	name: String,
	position: Number,
	profilePic: String
});
