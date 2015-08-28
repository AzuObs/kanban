(function() {
	"use strict";

	var kanbanDir = angular.module("kanban.directives", []);

	kanbanDir.directive("kbCategory", function() {
		return {
			restrict: "E",
			scope: {
				category: "="
			},
			replace: true,
			templateUrl: "templates/kanban.category.html"
		};
	});

	kanbanDir.directive("kbTask", function() {
		return {
			restrict: "E",
			scope: {
				task: "="
			},
			replace: true,
			templateUrl: "templates/kanban.task.html"
		};
	});

	kanbanDir.directive("kbWorker", function() {
		return {
			restrict: "E",
			scope: {
				worker: "="
			},
			replace: true,
			templateUrl: "templates/kanban.worker.html",
			controller: function($scope) {
				$scope.imgUrl = "http://imgur.com/" + $scope.worker.pictureUrl;
			}
		};
	});

})();
