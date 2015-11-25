(function() {
	"use strict";

	var TOKEN_SECRET = "danielsiteisbestsite";

	var JWT = require("jsonwebtoken");
	var mongoose = require("mongoose");
	var Task = mongoose.model("Task", require(process.cwd() + "/schemas/tasks.js"));
	var User = mongoose.model("User", require(process.cwd() + "/schemas/users.js"));
	var Board = mongoose.model("Board", require(process.cwd() + "/schemas/boards.js"));
	var Category = mongoose.model("Category", require(process.cwd() + "/schemas/categories.js"));
	var Comment = mongoose.model("Comment", require(process.cwd() + "/schemas/comments.js"));


	exports.createComment = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.body.boardId);
				var category = board.categories.id(req.body.catId);
				var task = category.tasks.id(req.body.taskId);
				var comment = new Comment({
					content: req.body.content,
					date: Date.now(),
					user: req.body.userId
				});

				task.comments.push(comment);

				user.save(function(err) {
					if (err) return res.send(err);
					res.status(201).json(comment);
				});
			});
	};


	exports.authenticate = function(req, res, next) {
		User.findOne({
			username: req.body.username,
			pwd: req.body.pwd
		}, function(err, user) {
			if (err) return res.send(err);
			if (!user) return res.sendStatus(404);

			var token = JWT.sign({
				username: user.username,
				pwd: user.pwd
			}, TOKEN_SECRET, {
				expiresInMinutes: 30
			});

			return res.status(201).json({
				username: user.username,
				userId: user._id,
				token: token
			});
		});
	};

	exports.authorize = function(req, res, next) {
		JWT.verify(req.headers.token, TOKEN_SECRET, function(err, decoded) {
			if (err) return res.sendStatus(401);
			next();
		});
	};

	exports.deleteBoard = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				user.boards.id(req.body.boardId).remove();
				user.save(function(err) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});
	};

	exports.deleteTask = function(req, res, next) {
		User
			.findById(req.params.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.params.boardId);
				var category = board.categories.id(req.params.categoryId);
				category.tasks.id(req.params.taskId).remove();
				user.save(function(err) {
					if (err) return send(err);
					res.sendStatus(204);
				});
			});
	};


	exports.deleteCategory = function(req, res, next) {
		User
			.findById(req.params.userId)
			.exec(function(err, user) {
				if (err) return res.send(user);
				var board = user.boards.id(req.params.boardId);
				board.categories.id(req.params.categoryId).remove();
				user.save(function(err) {
					if (err) return send(err);
					res.sendStatus(204);
				});
			});
	};


	exports.reassignCategories = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.body.boardId);
				board.categories = req.body.categories;
				user.save(function(err) {
					if (err) return res.send(err);
					res.status(200).json(board.categories);
				});
			});
	};


	exports.assignWorker = function(req, res, next) {
		User
			.findById(req.body.userId)
			.exec(function(err, user) {
				if (err) return res.send(err);
				var board = user.boards.id(req.body.boardId);
				var cat = board.categories.id(req.body.categoryId);
				var task = cat.tasks.id(req.body.taskId);
				var noWorkers = (task.workers.length === 0);
				task.workers = req.body.workersIds;
				user.save(function(err) {
					if (err) return res.send(err);
					if (noWorkers) {
						res.status(201).json(task);
					}
					res.status(200).json(task); //ok //created
				});
			});
	};


	exports.findUser = function(req, res, next) {
		User
			.findById(req.params.userId)
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
				var board = new Board({
					name: req.body.name,
					categories: [],
					workers: []
				});

				user.boards.push(board);
				user.save(function(err, user) {
					if (err) return res.send(err);
					res.status(201).json(board);
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

			var token = JWT.sign({
				username: user.username,
				pwd: user.pwd
			}, TOKEN_SECRET, {
				expiresInMinutes: 30
			});

			res.status(201).json({
				username: user.username,
				userId: user._id,
				token: token
			});
		});
	};


	module.exports = exports;
})();
