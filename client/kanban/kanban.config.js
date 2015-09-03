(function() {
	"use strict";

	var kanbanConfig = angular.module("kanban.config", ["ui.router"]);

	// EVIL
	// kanbanConfig.config(function($locationProvider) {
	// 	$locationProvider.html5Mode({
	// 		enabled: true,
	// 		requireBase: false
	// 	});
	// });


	kanbanConfig.config(function($stateProvider) {
		$stateProvider.state("kanban", {
			abstract: true,
			url: "/kanban",
			templateUrl: "kanban/templates/kanban.html",
			controller: "kanbanCtrl"
		});

		$stateProvider.state("kanban.boardlist", {
			url: "",
			templateUrl: "kanban/templates/kanban.list.html",
		});

		$stateProvider.state("kanban.board", {
			url: "/:boardId",
			templateUrl: "/kanban/templates/kanban.board.html"
		});
	});

})();
