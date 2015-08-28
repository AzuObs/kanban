(function() {
	"use strict";

	var kanbanConfig = angular.module("kanban.config", ["ui.router"]);

	kanbanConfig.config(function($stateProvider) {
		$stateProvider.state("kanban", {
			url: "/kanban",
			templateUrl: "templates/kanban.html",
			controller: "kanbanController"
		});
	});
})();
