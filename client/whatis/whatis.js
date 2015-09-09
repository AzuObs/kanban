(function() {
	"use strict";

	var whatIsModule = angular.module("whatIsModule", []);

	whatIsModule.config(function($stateProvider) {
		$stateProvider.state("whatis", {
			url: "/",
			templateUrl: "whatis/whatis.html"
		});
	});
})();
