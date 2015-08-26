(function() {
	"use strict";

	var express = require("express"),
		kanban = require(process.cwd() + "/routes/kanban.js");
	// category = require(process.cwd() + "/controllers/category"),
	// staff = require(process.cwd() + "/controllers/staff"),
	// task = require(process.cwd() + "/controllers/task");


	exports.createRoutes = function(app) {
		var router = express.Router();

		router.all("*", function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Content-Type, Token");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
			next();
		});

		router.get("/", kanban.getKanban);
		router.post("/", kanban.addKanban);
		router.delete("/", kanban.deleteKanban);


		router.post("/category/:name", kanban.addCategory);
		// router.put("/category/:id/:name", Category.editName);
		router.delete("/category/:id", kanban.deleteCategory);

		router.post("/staff/:name/:pictureUrl", kanban.addStaff);
		// router.put("/staff/:staffId/:name", Staff.editName);
		// router.put("/staff/:staffId/:picture", Staff.editPicture);
		router.put("/staff/:staffId/:oldTaskId/:newTaskId", kanban.reassignStaff);
		// router.delete("/staff/:staffId/:taskId", kanban.deleteStaff);

		router.post("/task/:name/:categoryId", kanban.addTask);
		// router.put("/task/:taskId/:name", Task.editName);
		router.put("/task/:taskId/:oldCatId/:newCatId", kanban.reassignTask);
		router.delete("/task/:taskId/:categoryId", kanban.deleteTask);

		app.use("/api", router);
	};

	module.exports = exports;
})();
