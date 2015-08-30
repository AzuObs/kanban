(function() {
	"use strict";

	var kanbanMod = angular.module("kanbanModule", [
		"ui.bootstrap",
		"kanban.services",
		"kanban.config",
		"kanban.directives",
		"ui.sortable"
	]);

	kanbanMod.controller("kanbanController", function($scope, $log, $modal, kanbanService) {
		$scope.kanban = {};
		var kanbanWorkers = [];

		function init() {
			$scope.getKanban();
		}

		$scope.getKanban = function() {
			kanbanService
				.getKanban()
				.then(function(res) {
					$scope.kanban = res;

					// GIVE my KANBAN useful Data that I'm gonna need
					//  

					kanbanWorkers = $scope.kanban.workers.slice();
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

		$scope.assignWorker = function(cId, tId, wId) {
			kanbanService
				.assignWorker(cId, tId, wId)
				.then(function(res) {
					$scope.getKanban();
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.taskSortOptions = {
			placeholder: ".task",
			connectWith: ".task-list"
		};

		$scope.workerSortOpts = {
			placeholder: "tast",
			connectWith: ".worker-list",
			stop: function(e, ui) {
				// clone worker and allocate him
				if ($(e.target).hasClass('worker-selection') &&
					ui.item.sortable.droptarget &&
					e.target != ui.item.sortable.droptarget[0]) {
					var ids = ui.item.sortable.droptarget[0].id;
					var cId = ids.substring(2, ids.search(" "));
					var tId = ids.substring(ids.search("t:") + 2, ids.length);
					var wId = ui.item.sortable.model._id;

					$scope.assignWorker(cId, tId, wId);
					$scope.kanban.workers = kanbanWorkers.slice();
				}
			}
		};

		$scope.taskModal = function() {
			console.log("taskModal ping");

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'kanban/templates/kanban.modal.html',
				controller: 'kanbanController'
			});
		};

		init();
	});
})();
