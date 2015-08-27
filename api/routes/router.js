(function() {
	"use strict";

	var express = require("express"),
		kanban = require(process.cwd() + "/routes/kanban.js");


	exports.createRoutes = function(app) {
		var router = express.Router();

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Content-Type, Token");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			next();
		});

		router.get("/", kanban.findKanban);
		router.post("/", kanban.createKanban);
		router.delete("/", kanban.deleteKanban);

		router.get("/worker/:id", kanban.findWorker);
		router.post("/worker/:name/:url", kanban.createWorker);
		router.delete("/worker/:id", kanban.deleteWorker);
		router.post("/worker/:wId/:cId/:tId", kanban.assignWorker);
		router.delete("/worker/:wId/:cId/:tId", kanban.unassignWorker);
		router.put("/worker/:wId/:oCId/:oTId/:nCId/:nTId", kanban.reassignWorker);

		router.post("/category/:name", kanban.createCategory);
		router.get("/category/:id", kanban.findCategory);
		router.delete("/category/:id", kanban.deleteCategory);

		router.post("/task/:cId/:name", kanban.createTask);
		router.get("/task/:cId/:tId", kanban.findTask);
		router.delete("/task/:cId/:tId", kanban.deleteTask);
		router.put("/task/:tId/:oCId/:nCId", kanban.reassignTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
