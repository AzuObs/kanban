(function() {
	"use strict";

	var app = angular.module("kanbanApp", ["ui.bootstrap", "ui.router", "kanbanModule"]);

	app.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state("whatis", {
			url: "/",
			templateUrl: "templates/whatis.html"
		});

		$stateProvider.state("about", {
			url: "/about",
			templateUrl: "templates/about.html",
			controller: function($scope) {
				$scope.resources = ["angularjs", "angular-ui-router", "angular-ui-bootstrap",
					"bootstrap.css", "nodejs", "expressjs", "mongodb", "mongoose", "github", "heroku"
				];
			}
		});

		$urlRouterProvider.otherwise("/");
	});

	app.controller("appCtrl", function($scope, $state) {
		$scope.state = $state;
	});
})();
