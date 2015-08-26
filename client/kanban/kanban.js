(function() {
	"use strict";

	var toDoModule = angular.module("toDoModule", ["ui.router", "ui.bootstrap", "taskModule"]);

	toDoModule.config(function($stateProvider) {
		$stateProvider.state("kanban", {
			url: "/kanban",
			templateUrl: "kanban/kanban.html",
			controller: "kanbanController"
		});
	});

	toDoModule.controller("kanbanController", function($scope, $log, Task) {
		function init() {
			$scope.getTasks();
			$scope.currentPage = 1;
			$scope.maxItems = 5;
		}

		$scope.getTasks = function() {
			Task.getTasks()
				.then(function(res) {
					$scope.tasks = Task.tasks;
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.createTask = function(content) {
			Task.createTask(content)
				.then(function(res) {
					$scope.getTasks();
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.editTask = function(task) {
			if (task.editting) {
				Task.editTask(task._id, task.content)
					.then(function(res) {
						$scope.getTasks();
					}, function(err) {
						$log.log(err);
					});
			}

			if (task.editting === "undefined") {
				task.editting = true;
			} else {
				task.editting = !task.editting;
			}
		};

		$scope.deleteTask = function(id) {
			Task.deleteTask(id)
				.then(function(res) {
					$scope.getTasks();
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.toggleEditting = function(id) {

		};

		init();
	});
})();
