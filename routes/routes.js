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

	exports.findBoard = function(req, res, next) {
		Board
			.findById(req.params.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);


				// populate all the userId areas

				res.status(200).json(board);

			});
	};

	exports.findBoardsForUser = function(req, res, next) {
		var totalBoards = [];

		Board
			.find({
				admins: {
					$elemMatch: req.params.userId
				}
			})
			.exec(function(err, boards) {
				if (err) return err;
				totalBoards.push(boards);
			});

		Board
			.find()
			.where("members").equals(req.params.userId)
			.exec(function(err, boards) {
				if (err) return err;
				totalBoards.push(boards);
			});

		res.status(200).json(totalBoards);
	};

	exports.createComment = function(req, res, next) {
		Board
			.findById(req.body.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.body.catId);
				var task = category.tasks.id(req.body.taskId);
				var comment = new Comment({
					content: req.body.content,
					date: Date.now(),
					user: req.body.userId
				});

				task.comments.push(comment);

				board.save(function(err) {
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

			return res.status(200).json({
				user: user,
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
		Board
			.findById(req.params.boardId)
			.remove(function(err, board) {
				if (err) return res.send(err);
				res.sendStatus(204);
			});
	};


	exports.deleteCategory = function(req, res, next) {
		Board
			.findById(req.params.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.categories.id(req.params.categoryId).remove();
				board.save(function(err) {
					if (err) return send(err);
					res.sendStatus(204);
				});
			});
	};


	exports.deleteTask = function(req, res, next) {
		Board
			.findById(req.params.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.params.categoryId);
				category.tasks.id(req.params.taskId).remove();
				board.save(function(err) {
					if (err) return send(err);
					res.sendStatus(204);
				});
			});
	};


	exports.updateBoard = function(req, res, next) {
		Board
			.findById(req.body.board._id)
			.exec(function(err, board) {
				if (err) return res.send(err);
				board = req.body.board;
				board.save(function(err) {
					if (err) return res.send(err);
					res.status(200).json(board);
				});
			});
	};


	exports.assignUser = function(req, res, next) {
		Board
			.findById(req.body.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				var cat = board.categories.id(req.body.categoryId);
				var task = cat.tasks.id(req.body.taskId);
				var noUsers = (task.users.length === 0);
				task.users = req.body.usersIds;
				board.save(function(err) {
					if (err) return res.send(err);
					if (noUsers) {
						res.status(201).json(task);
					}
					res.status(200).json(task);
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
		Board
			.findById(req.body.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				var category = board.categories.id(req.body.categoryId);
				category.tasks.push(new Task({
					name: req.body.name,
					position: Number(req.body.position),
					users: [],
					comments: []
				}));
				board.save(function(err) {
					if (err) return res.send(err);
					res.status(201).json(category.tasks[category.tasks.length - 1]);
				});
			});
	};


	exports.createCategory = function(req, res, next) {
		Board
			.findById(req.body.boardId)
			.exec(function(err, board) {
				if (err) return res.send(err);
				board.categories.push(new Category({
					name: req.body.name,
					position: Number(req.body.position),
					tasks: []
				}));
				board.save(function(err) {
					if (err) return res.send(err);
					res.status(201).json(board.categories[board.categories.length - 1]);
				});
			});
	};


	exports.createBoard = function(req, res, next) {
		Board.create(new Board({
			name: req.body.name,
			admins: [req.body.user],
			members: [],
			categories: []
		}), function(err, board) {
			if (err) res.send(err);
			res.status(201).json(board);
		});
	};


	exports.createUser = function(req, res, next) {

		User.create(new User({
			username: req.body.username,
			pwd: req.body.pwd,
			pictureUrl: req.body.pictureUrl
		}), function(err, user) {
			if (err) return res.send(err);

			var token = JWT.sign({
				username: user.username,
				pwd: user.pwd
			}, TOKEN_SECRET, {
				expiresInMinutes: 30
			});

			res.status(201).json({
				user: user,
				token: token
			});
		});
	};


	module.exports = exports;
})();
