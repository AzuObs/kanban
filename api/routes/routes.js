(function() {
	"use strict";

	var mongoose = require("mongoose");
	var boardSchema = require(process.cwd() + "/schemas/board.js");
	var categorySchema = require(process.cwd() + "/schemas/categories.js");
	var taskSchema = require(process.cwd() + "/schemas/tasks.js");
	var workerSchema = require(process.cwd() + "/schemas/workers.js");
	var Board = mongoose.model("Board", boardSchema);
	var Category = mongoose.model("Category", categorySchema);
	var Task = mongoose.model("Task", taskSchema);
	var Worker = mongoose.model("Worker", workerSchema);

	exports.reassignWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var oldCat = board.categories.id(req.params.oCId);
				var oldTask = oldCat.tasks.id(req.params.oTId);
				oldTask.workers.id(req.params.wId).remove();

				var worker = board.workers.id(req.params.wId);
				var newCat = board.categories.id(req.params.nCId);
				var newTask = newCat.tasks.id(req.params.nTId);
				newTask.workers.push(worker);

				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.unassignWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.cId);
				var task = category.tasks.id(req.params.tId);
				task.workers.id(req.params.wId).remove();
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.assignWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.cId);
				var task = category.tasks.id(req.params.tId);
				task.workers.push(board.workers.id(req.params.wId));
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.reassignTask = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var oldCat = board.categories.id(req.params.oCId);
				var newCat = board.categories.id(req.params.nCId);
				var task = oldCat.tasks.id(req.params.tId);
				oldCat.tasks.id(req.params.tId).remove();
				newCat.tasks.push(task);
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteTask = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.cId);
				category.tasks.id(req.params.tId).remove();
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findTask = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.cId);
				res.send(category.tasks.id(req.params.tId));
			});
	};


	exports.createTask = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.cId);
				category.tasks.push(new Task({
					name: req.params.name,
					workers: []
				}));
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteCategory = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.categories.id(req.params.id).remove();
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findCategory = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				res.send(board.categories.id(req.params.id));
			});
	};

	exports.createCategory = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.categories.push(new Category({
					name: req.params.name,
					tasks: []
				}));
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.workers.id(req.params.id).remove();
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				res.json(board.workers.id(req.params.id));
			});
	};

	exports.createWorker = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.workers.push(new Worker({
					name: req.params.name,
					pictureUrl: req.params.url
				}));
				board.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findBoard = function(req, res, next) {
		Board
			.findOne()
			.exec(function(err, board) {
				if (err) return res.send(err);
				res.json(board);
			});
	};

	exports.createBoard = function(req, res, next) {
		Board
			.create(new Board({
				categories: [],
				workers: []
			}), function(err) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};

	exports.deleteBoard = function(req, res, next) {
		Board
			.find()
			.remove()
			.exec(function(err) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};


	module.exports = exports;
})();
