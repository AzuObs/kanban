(function() {
	"use strict";

	var express = require("express"),
		routes = require(process.cwd() + "/routes/routes.js"),
		bodyParser = require("body-parser");


	exports.createRoutes = function(app) {
		var router = express.Router();

		app.use(bodyParser.json());

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE");
			res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Token");
			next();
		});

		router.get("/user/:userId", routes.authorize, routes.findUser);

		router.post("/user/loggin", routes.authenticate); //params: username, pwd
		router.post("/user", routes.createUser); //params: username, pwd
		router.post("/board", routes.authorize, routes.createBoard); //params: userId, name
		router.post("/category", routes.authorize, routes.createCategory); //params: userId, boardId, position, name
		router.post("/task", routes.authorize, routes.createTask); //params: userId, boardId, categoryId, position, name
		router.post("/comment", routes.authorize, routes.createComment); //params: userId, boardId, catId, taskId, content

		router.put("/task/workers", routes.authorize, routes.assignWorker); //params: userId, boardId, categoryId, taskId, workersIds[]
		router.put("/categories", routes.authorize, routes.reassignCategories); //params: userId, boardId, categories: []

		router.delete("/category/:userId/:boardId/:categoryId", routes.authorize, routes.deleteCategory);
		router.delete("/task/:userId/:boardId/:categoryId/:taskId", routes.authorize, routes.deleteTask);
		router.delete("/board", routes.authorize, routes.deleteBoard);

		app.use("/api", router);
	};

	module.exports = exports;
})();
