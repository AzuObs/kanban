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

	exports.deleteUserFromBoard = function(req, res, next) {
		Board
			.findOne({
				_id: req.params.boardId
			})
			.exec(function(err, board) {
				var iAdmin = board.admins.indexOf(req.params.userId);
				var iMember = board.members.indexOf(req.params.userId);

				if (iMember < 0 && iAdmin < 0 || err) {
					return res.send(err);
				}

				if (iAdmin >= 0) {
					board.admins.splice(iAdmin, 1);
				}

				if (iMember >= 0) {
					board.members.splice(iMember, 1);
				}

				board.save(function(err, board) {
					if (err) return res.send(err);
					res.sendStatus(204);
				});
			});

	};

	// has to be idempotent
	exports.addMemberToBoard = function(req, res, next) {
		User
			.findOne({
				email: req.body.userEmail
			})
			.exec(function(err, user) {
				if (err) return res.status(404).send("err: could not find user");
				var userId = user._id;

				Board
					.findOne({
						_id: req.body.boardId
					})
					.populate("admins")
					.populate("members")
					.exec(function(err, board) {
						//check first that user is not already in the board
						if (board.admins.indexOf(userId) != -1) return res.send(board);
						if (board.members.indexOf(userId) != -1) return res.send(board);
						board.members.push(user);
						board.save(function(err, board) {
							if (err) return res.send(err);
							res.status(200).send(board);
						});
					});
			});
	};


	exports.findBoard = function(req, res, next) {
		Board
			.findById(req.params.boardId)
			.populate("admins")
			.populate("members")
			.exec(function(err, board) {
				if (err) return res.send(err);
				res.status(200).json(board);
			});
	};

	exports.findBoardsForUser = function(req, res, next) {
		Board
			.find({
				$or: [{
					members: {
						$elemMatch: {
							$eq: req.params.userId
						}
					}
				}, {
					admins: {
						$elemMatch: {
							$eq: req.params.userId
						}
					}
				}]
			})
			.populate("admins")
			.populate("members")
			.exec(function(err, boards) {
				if (err) res.send(err);
				res.status(200).json(boards);
			});

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
				expiresInMinutes: 180
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
		//cannot find&replace board, because new object will not have a .save()
		//delete old, create new board instead
		Board
			.findById(req.body.board._id)
			.exec(function(err, board) {
				if (err) return res.send(err);
				if (board._v > req.body.board._v) {
					res.status(403).send("your board is outdated, a newer version exists on the server");
				}
				deepCopy(req.body.board, board);
				board.save(function(err, board) {
					if (err) res.send(err);
					res.status(201).send(board);
				});
			});

		var deepCopy = function(src, dest) {
			var srcKeys = Object.keys(src);

			for (var i = 0; i < srcKeys.length; i++) {
				dest[srcKeys[i]] = src[srcKeys[i]];
			}
		};
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
			admins: [req.body.userId],
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
