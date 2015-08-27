(function() {
	"use strict";

	var toDoModule = angular.module("toDoModule", ["ui.router", "ui.bootstrap", "kanbanModule"]);

	toDoModule.config(function($stateProvider) {
		$stateProvider.state("kanban", {
			url: "/kanban",
			templateUrl: "kanban/kanban.html",
			controller: "kanbanController"
		});
	});

	toDoModule.controller("kanbanController", function($scope, $log, Kanban) {
		function init() {
			$scope.getKanban();
		}

		$scope.getKanban = function() {
			Kanban
				.getKanban()
				.then(function(res) {
					$scope.kanban = res;
					console.log($scope.kanban);
				}, function(err) {
					$log.log(err);
				});
		};

		init();
	});
})();
