(function() {
	"use strict";

	var kanbanMod = angular.module("kanbanModule", [
		"ui.bootstrap",
		"kanban.services",
		"kanban.config",
		"kanban.directives"
	]);

	kanbanMod.controller("kanbanController", function($scope, $log, Kanban) {
		function init() {
			$scope.getKanban();
		}

		$scope.getKanban = function() {
			Kanban
				.getKanban()
				.then(function(res) {
					$scope.kanban = res;
				}, function(err) {
					$log.log(err);
				});
		};

		init();
	});
})();
