(function() {
	"use strict";

	var app = angular.module("kanbanApp", [
		"ui.bootstrap",
		"ui.router",
		"kanbanModule",
		"logginModule",
		"aboutModule",
		"whatIsModule",
		"errorHandlerModule"
	]);


	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/loggin");
	});


	app.run(function($rootScope, $state, $log) {
		$rootScope.endPoint = "http://localhost:8000/api";
		$rootScope.state = $state;
		$rootScope.showSpinner = false;

		$rootScope.$on("$stateChangeStart", function(event, toState) {
			if (toState.name === "kanban.boardList") $rootScope.showSpinner = true;
		});

		$rootScope.$on("$stateChangeSuccess", function(event) {
			$rootScope.showSpinner = false;
		});

		$rootScope.$on("$stateChangeError", function(event, toState, toParams) {
			event.preventDefault(); //stops ui-router from reverting to previous successful url
			$rootScope.showSpinner = false;
		});
	});


})();
