(function() {
	"use strict";

	var express = require("express"),
		routes = require(process.cwd() + "/routes/routes.js"),
		bodyParser = require("body-parser");


	exports.createRoutes = function(app) {
		var router = express.Router();

		app.use(bodyParser.json());

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "http://localhost");
			res.header("Access-Control-Allow-Headers", "Content-Type, Token");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			next();
		});


		router.post("/user", routes.createUser); //params: username, pwd
		router.post("/board/", routes.createBoard); //params: userId, name
		router.post("/category", routes.createCategory); //params: userId, boardId, position, name
		router.post("/task", routes.createTask); //params: userId, boardId, categoryId, position, name

		router.get("/user/:id", routes.findUser);

		// router.post("/worker/:name/:url", routes.createWorker);
		// router.delete("/worker/:id", routes.deleteWorker);
		// router.post("/worker/:wId/:cId/:tId", routes.assignWorker);
		// router.delete("/worker/:wId/:cId/:tId", routes.unassignWorker);
		// router.put("/worker/:wId/:oCId/:oTId/:nCId/:nTId", routes.reassignWorker);

		// router.get("/category/:id", routes.findCategory);
		// router.delete("/category/:id", routes.deleteCategory);

		// router.post("/task/:cId/:name", routes.createTask);
		// router.get("/task/:cId/:tId", routes.findTask);
		// router.delete("/task/:cId/:tId", routes.deleteTask);
		// router.put("/task/:tId/:oCId/:nCId", routes.reassignTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
