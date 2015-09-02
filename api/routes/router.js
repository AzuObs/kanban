(function() {
	"use strict";

	var express = require("express"),
		routes = require(process.cwd() + "/routes/routes.js");


	exports.createRoutes = function(app) {
		var router = express.Router();

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Content-Type, Token");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			next();
		});

		router.get("/", routes.findBoard);
		router.post("/", routes.createBoard);
		router.delete("/", routes.deleteBoard);

		router.get("/worker/:id", routes.findWorker);
		router.post("/worker/:name/:url", routes.createWorker);
		router.delete("/worker/:id", routes.deleteWorker);
		router.post("/worker/:wId/:cId/:tId", routes.assignWorker);
		router.delete("/worker/:wId/:cId/:tId", routes.unassignWorker);
		router.put("/worker/:wId/:oCId/:oTId/:nCId/:nTId", routes.reassignWorker);

		router.post("/category/:name", routes.createCategory);
		router.get("/category/:id", routes.findCategory);
		router.delete("/category/:id", routes.deleteCategory);

		router.post("/task/:cId/:name", routes.createTask);
		router.get("/task/:cId/:tId", routes.findTask);
		router.delete("/task/:cId/:tId", routes.deleteTask);
		router.put("/task/:tId/:oCId/:nCId", routes.reassignTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
