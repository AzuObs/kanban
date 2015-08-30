(function() {
	"use strict";

	var kanbanDir = angular.module("kanban.directives", ["ui.bootstrap"]);

	kanbanDir.directive("kbCategory", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.category.html"
		};
	});

	kanbanDir.directive("kbTask", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.task.html"
		};
	});

	kanbanDir.directive("kbWorker", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.worker.html"
		};
	});

})();
