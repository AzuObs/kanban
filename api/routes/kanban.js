(function() {
	"use strict";

	var mongoose = require("mongoose");
	var kanbanSchema = require(process.cwd() + "/models/kanbans.js");
	var categorySchema = require(process.cwd() + "/models/categories.js");
	var staffSchema = require(process.cwd() + "/models/staff.js");
	var taskSchema = require(process.cwd() + "/models/tasks.js");
	var Kanban = mongoose.model("Kanban", kanbanSchema);
	var Category = mongoose.model("Category", categorySchema);
	var Staff = mongoose.model("Staff", staffSchema);
	var Task = mongoose.model("Task", taskSchema);


	exports.getKanban = function(req, res, next) {
		Kanban.findOne(function(err, kanban) {
			if (err) return res.send(err);
			res.json(kanban);
		});
	};


	// development only
	exports.addKanban = function(req, res, next) {
		Kanban.create(new Kanban({
			categories: [],
			tasks: [],
			staff: []
		}), function(err, kanban) {
			if (err) return res.send(err);
			res.sendStatus(204);
		});
	};


	// development only
	exports.deleteKanban = function(req, res, next) {
		Kanban
			.find()
			.remove()
			.exec(function(err) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};


	exports.addCategory = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.categories.push(new Category({
					name: req.params.name,
					taskIds: []
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


	exports.addStaff = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.staff.push(new Staff({
					name: req.params.name,
					profilePictureUrl: req.params.pictureUrl
				}));
				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.reassignStaff = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);

				if (Number(req.params.oldTaskId) !== -1) {
					deleteStaffInTask(kanban, req.params.staffId, req.params.oldTaskId);
				}
				var foo = kanban.tasks.id(req.params.newTaskId).staffIds.push(req.params.staffId);

				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};


	// exports.deleteStaff = function(req, res, next) {
	// 	Kanban
	// 		.findOne()
	// 		.exec(function(err, kanban) {
	// 			if (err) return res.send(err);

	// 			deleteStaffInTask(kanban, req.params.staffId, req.params.taskId);

	// 			kanban.staff.id(req.params.staffId).remove();
	// 			kanban.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };


	exports.addTask = function(req, res, next) {
		Kanban
			.findOne()
			.exec(function(err, kanban) {
				if (err) return res.send(err);
				kanban.tasks.push(new Task({
					name: req.params.name,
					staffIds: []
				}));
				var taskId = kanban.tasks[kanban.tasks.length - 1]._id;
				kanban.categories.id(req.params.categoryId).taskIds.push(taskId);
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

				kanban.categories.id(req.params.newCatId).taskIds.push(req.params.taskId);
				deleteTaskInCategory(kanban, req.params.taskId, req.params.oldCatId);

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
				kanban.tasks.id(req.params.taskId).remove();
				deleteTaskInCategory(kanban, req.params.taskId, req.params.categoryId);

				kanban.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};


	var deleteTaskInCategory = function(kanban, taskId, categoryId) {
		var category = kanban.categories.id(categoryId);
		for (var i = 0; i < category.taskIds.length; i++) {
			if (JSON.stringify(category.taskIds[i]) === JSON.stringify(taskId)) {
				category.taskIds.splice(i, 1);
			}
		}
	};


	var deleteStaffInTask = function(kanban, staffId, taskId) {
		var task = kanban.tasks.id(taskId);
		for (var i = 0; i < task.staffIds.length; i++) {
			if (JSON.stringify(task.staffIds[i]) === JSON.stringify(staffId)) {
				task.staffIds.splice(i, 1);
			}
		}
	};

	module.exports = exports;
})();
