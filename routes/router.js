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
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
			next();
		});

		router.get("/user/:userId", routes.lag, routes.authorize, routes.findUser);

		router.post("/user/loggin", routes.lag, routes.authenticate); //params: username, pwd
		router.post("/user", routes.lag, routes.authorize, routes.createUser); //params: username, pwd
		router.post("/board", routes.lag, routes.authorize, routes.createBoard); //params: userId, name
		router.post("/category", routes.lag, routes.authorize, routes.createCategory); //params: userId, boardId, position, name
		router.post("/task", routes.lag, routes.authorize, routes.createTask); //params: userId, boardId, categoryId, position, name
		router.post("/comments", routes.lag, routes.authorize, routes.createComment); //params: userId, boardId, catId, taskId, content

		router.put("/task/workers", routes.lag, routes.authorize, routes.assignWorker); //params: userId, boardId, categoryId, taskId, workersIds[]
		router.put("/categories", routes.lag, routes.authorize, routes.reassignCategories); //params: userId, boardId, categories: []

		router.delete("/category/:userId/:boardId/:categoryId", routes.lag, routes.authorize, routes.deleteCategory);
		router.delete("/task/:userId/:boardId/:categoryId/:taskId", routes.lag, routes.authorize, routes.deleteTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
