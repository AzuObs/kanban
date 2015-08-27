(function() {
	"use strict";

	var mongoose = require("mongoose");
	var kanbanSchema = require(process.cwd() + "/schemas/kanbans.js");
	var categorySchema = require(process.cwd() + "/schemas/categories.js");
	var taskSchema = require(process.cwd() + "/schemas/tasks.js");
	var workerSchema = require(process.cwd() + "/schemas/workers.js");
	var Kanban = mongoose.model("Kanban", kanbanSchema);
	var Category = mongoose.model("Category", categorySchema);
	var Task = mongoose.model("Task", taskSchema);
	var Worker = mongoose.model("Worker", workerSchema);

	exports.reassignWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var oldCat = kanban.categories.id(req.params.oCId);
				var oldTask = oldCat.tasks.id(req.params.oTId);
				oldTask.workers.id(req.params.wId).remove();

				var worker = kanban.workers.id(req.params.wId);
				var newCat = kanban.categories.id(req.params.nCId);
				var newTask = newCat.tasks.id(req.params.nTId);
				newTask.workers.push(worker);

				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.unassignWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var category = kanban.categories.id(req.params.cId);
				var task = category.tasks.id(req.params.tId);
				task.workers.id(req.params.wId).remove();
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.assignWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var category = kanban.categories.id(req.params.cId);
				var task = category.tasks.id(req.params.tId);
				task.workers.push(kanban.workers.id(req.params.wId));
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.reassignTask = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var oldCat = kanban.categories.id(req.params.oCId);
				var newCat = kanban.categories.id(req.params.nCId);
				var task = oldCat.tasks.id(req.params.tId);
				oldCat.tasks.id(req.params.tId).remove();
				newCat.tasks.push(task);
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteTask = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var category = kanban.categories.id(req.params.cId);
				category.tasks.id(req.params.tId).remove();
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findTask = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var category = kanban.categories.id(req.params.cId);
				res.send(category.tasks.id(req.params.tId));
			});
	};


	exports.createTask = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				var category = kanban.categories.id(req.params.cId);
				category.tasks.push(new Task({
					name: req.params.name,
					workers: []
				}));
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteCategory = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.categories.id(req.params.id).remove();
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findCategory = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				res.send(kanban.categories.id(req.params.id));
			});
	};

	exports.createCategory = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.categories.push(new Category({
					name: req.params.name,
					tasks: []
				}));
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.workers.id(req.params.id).remove();
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				res.json(kanban.workers.id(req.params.id));
			});
	};

	exports.createWorker = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.workers.push(new Worker({
					name: req.params.name,
					pictureUrl: req.params.url
				}));
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.findKanban = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				res.json(kanban);
			});
	};

	exports.createKanban = function(req, res, next) {
		Kanban
			.create(new Kanban({
				categories: [],
				workers: []
			}), function(err) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};

	exports.deleteKanban = function(req, res, next) {
		Kanban
			.find()
			.remove()
			.exec(function(err) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};


	module.exports = exports;
})();
