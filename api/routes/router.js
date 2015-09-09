(function() {
	"use strict";

	var express = require("express"),
		routes = require(process.cwd() + "/routes/routes.js"),
		bodyParser = require("body-parser");


	exports.createRoutes = function(app) {
		var router = express.Router();

		app.use(bodyParser.json());

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "http://localhost:3000");
			res.header("Access-Control-Allow-Headers", "Content-Type, Token");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			next();
		});


		router.post("/user/loggin", routes.wait, routes.authenticate); //params: username, pwd
		router.post("/user", routes.wait, routes.authorize, routes.createUser); //params: username, pwd
		router.post("/board", routes.wait, routes.authorize, routes.createBoard); //params: userId, name
		router.post("/category", routes.wait, routes.authorize, routes.createCategory); //params: userId, boardId, position, name
		router.post("/task", routes.wait, routes.authorize, routes.createTask); //params: userId, boardId, categoryId, position, name
		router.get("/user/:userId", routes.wait, routes.authorize, routes.findUser);

		router.put("/task/workers", routes.wait, routes.authorize, routes.assignWorker); //params: userId, boardId, categoryId, taskId, workersIds[]
		router.put("/categories", routes.wait, routes.authorize, routes.reassignCategories); //params: userId, boardId, categories: []

		router.delete("/category/:userId/:boardId/:categoryId", routes.wait, routes.authorize, routes.deleteCategory);
		router.delete("/task/:userId/:boardId/:categoryId/:taskId", routes.wait, routes.authorize, routes.deleteTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
