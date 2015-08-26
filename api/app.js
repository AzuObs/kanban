var express = require("express"),
	mongoose = require("mongoose"),
	Tasks = require(process.cwd() + "/controllers/tasks.js");

var app = express();
var router = express.Router();


mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/to-do-app:27017", function(err) {
	if (err) console.log("mongoose didn't connect: " + err);
});

router.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type, Token");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
	next();
});

router.get("/tasks", Tasks.getTasks);
router.post("/tasks/:content", Tasks.createTask);
router.put("/tasks/:id/content/:content", Tasks.editTaskById);
router.delete("/tasks/:id", Tasks.deleteTaskById);

app.use("/app", router);


app.listen(process.env.PORT || 8000);
console.log("server listening");

process.on("uncaughtException", function(err) {
	console.log(err);
});
