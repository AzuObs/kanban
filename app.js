var app = require("express")(),
  mongoose = require("mongoose"),
  router = require(process.cwd() + "/routes/router.js"),
  resetDB = require(process.cwd() + "/database-reset/database-reset.js");


router.createRoutes(app);

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/kanban:27017");
mongoose.connection.on("error", function(err) {
  console.log("mongoose didn't connect: " + err);
});
mongoose.connection.on("open", function() {
  // reset database periodically because this website is only a "demo/prototype"
  resetDB(5 * 60 * 1000);
});

app.listen(process.env.PORT || 8000);

process.on("uncaughtException", function(err) {
  console.log(err);
});
