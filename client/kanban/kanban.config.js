(function() {
	"use strict";

	var kanbanConfig = angular.module("kanban.config", ["ui.router"]);

	kanbanConfig.config(function($stateProvider) {
		$stateProvider.state("kanban", {
			abstract: true,
			url: "/kanban",
			templateUrl: "kanban/templates/kanban.html",
		});

		$stateProvider.state("kanban.loggin", {
			url: "/loggin",
			templateUrl: "kanban/templates/kanban.loggin.html"
		});

		$stateProvider.state("kanban.boardlist", {
			url: "",
			templateUrl: "kanban/templates/kanban.list.html",
		});

		$stateProvider.state("kanban.board", {
			url: "/:boardId",
			templateUrl: "/kanban/templates/kanban.board.html",
			controller: "kanbanController"
		});
	});

})();
