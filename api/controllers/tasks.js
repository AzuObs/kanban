(function() {
	"use strict";

	var Task = require(process.cwd() + "/models/task.js");


	exports.getTasks = function(req, res, next) {
		Task.find(function(err, tasks) {
			if (err) return res.send(err);
			res.send(tasks);
		});
	};


	exports.createTask = function(req, res, next) {
		Task.create({
			content: req.params.content
		}, function(err, task) {
			if (err) return res.send(err);
			res.sendStatus(201); //created
		});
	};


	exports.editTaskById = function(req, res, next) {
		Task.findByIdAndUpdate(req.params.id, {
			content: req.params.content
		}, {
			new: true
		}, function(err, task) {
			if (err) return res.send(err);
			res.sendStatus(204); //no content
		});
	};


	exports.deleteTaskById = function(req, res, next) {
		Task.findByIdAndRemove(req.params.id, function(err) {
			if (err) return res.send(err);
			res.sendStatus(204); //no content
		});
	};


	module.exports = exports;
})();
