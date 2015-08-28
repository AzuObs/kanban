(function() {
	"use strict";

	var kanbanMod = angular.module("kanbanModule", [
		"ui.bootstrap",
		"kanban.services",
		"kanban.config",
		"kanban.directives"
	]);

	kanbanMod.controller("kanbanController", function($scope, $log, kanbanService) {
		function init() {
			$scope.getKanban();
		}

		$scope.getKanban = function() {
			kanbanService
				.getKanban()
				.then(function(res) {
					$scope.kanban = res;
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.createCategory = function(name, keyEvent) {
			if (!keyEvent || keyEvent.which === 13) {
				$scope.newCat = "";
				kanbanService
					.createCategory(name)
					.then(function(res) {
						$scope.getKanban();
					}, function(err) {
						$log.log(err);
					});
			}
		};

		$scope.deleteCategory = function(id) {
			kanbanService
				.deleteCategory(id)
				.then(function(res) {
					$scope.getKanban();
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.createTask = function(name, catId, keyEvent) {
			if (!keyEvent || keyEvent.which === 13) {
				$scope.newTask = "";
				kanbanService
					.createTask(name, catId)
					.then(function(res) {
						$scope.getKanban();
					}, function(err) {
						$log.log(err);
					});
			}
		};

		$scope.deleteTask = function(catId, taskId) {
			kanbanService
				.deleteTask(catId, taskId)
				.then(function(res) {
					$scope.getKanban();
				}, function(err) {
					$log.log(err);
				});
		};

		init();
	});
})();
