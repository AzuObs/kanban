(function() {
	"use strict";

	var kanbanServices = angular.module("kanban.services", ["ngResource"]);

	kanbanServices.run(function($rootScope) {
		$rootScope.endPoint = "http://localhost:8000/api/";
	});

	kanbanServices.service("Kanban", function($log, $rootScope, $q, $http) {
		var Kanban = this;
		Kanban.kanban = {};

		Kanban.getKanban = function() {
			var defer = $q.defer();

			$http
				.get($rootScope.endPoint)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};


	});


})();
