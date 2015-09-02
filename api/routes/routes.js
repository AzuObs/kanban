(function() {
	"use strict";

	var mongoose = require("mongoose");
	var User = mongoose.model("User", require(process.cwd() + "/schemas/users.js"));
	var Board = mongoose.model("Board", require(process.cwd() + "/schemas/boards.js"));
	var Category = mongoose.model("Category", require(process.cwd() + "/schemas/categories.js"));
	var Task = mongoose.model("Task", require(process.cwd() + "/schemas/tasks.js"));


	exports.findUser = function(req, res, next) {
		User
			.findById(req.params.id)
			.exec(function(err, user) {
				if (err) return res.send(err);
				res.status(200).json(user);
			});
	};


	exports.createTask = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.body.boardId);
				var category = board.categories.id(req.body.categoryId);
				category.tasks.push(new Task({
					name: req.body.name,
					position: Number(req.body.position),
					workers: [],
					comments: []
				}));
				user.save(function(err) {
					if (err) return res.send(err);
					res.status(201).json(category.tasks[category.tasks.length - 1]);
				});
			});
	};


	exports.createCategory = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.body.boardId);
				board.categories.push(new Category({
					name: req.body.name,
					position: Number(req.body.position),
					tasks: []
				}));
				user.save(function(err) {
					if (err) return res.send(err);
					res.status(201).json(board.categories[board.categories.length - 1]);
				});
			});
	};


	exports.createBoard = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				user.boards.push(new Board({
					name: req.body.name,
					categories: [],
					workers: []
				}));
				user.save(function(err, user) {
					if (err) return res.send(err);
					res.status(201).json(user.boards);
				});
			});
	};


	exports.createUser = function(req, res, next) {
		User.create(new User({
			username: req.body.username,
			pwd: req.body.pwd,
			boards: []
		}), function(err, user) {
			if (err) return res.send(err);
			res.status(201).json(user);
		});
	};


	// exports.reassignWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var oldCat = board.categories.id(req.params.oCId);
	// 			var oldTask = oldCat.tasks.id(req.params.oTId);
	// 			oldTask.workers.id(req.params.wId).remove();

	// 			var worker = board.workers.id(req.params.wId);
	// 			var newCat = board.categories.id(req.params.nCId);
	// 			var newTask = newCat.tasks.id(req.params.nTId);
	// 			newTask.workers.push(worker);

	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.unassignWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var category = board.categories.id(req.params.cId);
	// 			var task = category.tasks.id(req.params.tId);
	// 			task.workers.id(req.params.wId).remove();
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.assignWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var category = board.categories.id(req.params.cId);
	// 			var task = category.tasks.id(req.params.tId);
	// 			task.workers.push(board.workers.id(req.params.wId));
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.reassignTask = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var oldCat = board.categories.id(req.params.oCId);
	// 			var newCat = board.categories.id(req.params.nCId);
	// 			var task = oldCat.tasks.id(req.params.tId);
	// 			oldCat.tasks.id(req.params.tId).remove();
	// 			newCat.tasks.push(task);
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.deleteTask = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var category = board.categories.id(req.params.cId);
	// 			category.tasks.id(req.params.tId).remove();
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.findTask = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var category = board.categories.id(req.params.cId);
	// 			res.send(category.tasks.id(req.params.tId));
	// 		});
	// };


	// exports.createTask = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			var category = board.categories.id(req.params.cId);
	// 			category.tasks.push(new Task({
	// 				name: req.params.name,
	// 				workers: []
	// 			}));
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.deleteCategory = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			board.categories.id(req.params.id).remove();
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.findCategory = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			res.send(board.categories.id(req.params.id));
	// 		});
	// };


	// exports.deleteWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			board.workers.id(req.params.id).remove();
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };

	// exports.findWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			res.json(board.workers.id(req.params.id));
	// 		});
	// };

	// exports.createWorker = function(req, res, next) {
	// 	Board
	// 		.findOne()
	// 		.exec(function(err, board) {
	// 			if (err) return res.send(err);
	// 			board.workers.push(new Worker({
	// 				name: req.params.name,
	// 				pictureUrl: req.params.url
	// 			}));
	// 			board.save(function(err) {
	// 				if (err) return res.send(err);
	// 				res.sendStatus(204);
	// 			});
	// 		});
	// };


	// exports.deleteBoard = function(req, res, next) {
	// 	Board
	// 		.find()
	// 		.remove()
	// 		.exec(function(err) {
	// 			if (err) return res.send(err);
	// 			res.sendStatus(204);
	// 		});
	// };


	module.exports = exports;
})();
