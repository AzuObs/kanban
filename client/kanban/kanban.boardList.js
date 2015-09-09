(function() {
	"use strict";

	var kanbanMod = angular.module("kanbanBoardListModule", ["userServiceModule"]);

	kanbanMod.config(function($stateProvider) {
		$stateProvider.state("kanban.boardlist", {
			url: "/user/:username",
			templateUrl: "kanban/templates/kanban.list.html",
			controller: "kanbanBoardListCtrl",
			resolve: {
				user: function(userService) {
					return userService.getUser();
				}
			}
		});
	});

	kanbanMod.controller("kanbanBoardListCtrl", function($scope, user) {
		$scope.user = user;
	});

})();
