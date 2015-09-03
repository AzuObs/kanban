(function() {
	"use strict";

	var app = angular.module("kanbanApp", ["ui.bootstrap", "ui.router", "kanbanModule", "logginModule"]);

	app.run(function($rootScope) {
		$rootScope.endPoint = "http://localhost:8000/api";
	});


	app.config(function($httpProvider) {
		$httpProvider.interceptors.push(function() {
			return {
				request: function(req) {
					if (sessionStorage.token) {
						req.headers.token = sessionStorage.token;
					}
					return req;
				}
			};
		});
	});


	app.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state("whatis", {
			url: "/",
			templateUrl: "templates/whatis.html"
		});

		$stateProvider.state("loggin", {
			url: "/loggin",
			templateUrl: "loggin/loggin.html",
			controller: "logginCtrl"
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
