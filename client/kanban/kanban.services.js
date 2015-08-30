(function() {
	"use strict";

	var kanbanServices = angular.module("kanban.services", ["ngResource"]);

	kanbanServices.run(function($rootScope) {
		$rootScope.endPoint = "http://localhost:8000/api/";
	});

	kanbanServices.service("kanbanService", function($log, $rootScope, $q, $http) {
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

		Kanban.createCategory = function(name) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/category/" + name)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Kanban.deleteCategory = function(id) {
			var defer = $q.defer();

			$http
				.delete($rootScope.endPoint + "/category/" + id)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Kanban.createTask = function(name, cId) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/task/" + cId + "/" + name)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Kanban.deleteTask = function(cId, tId) {
			var defer = $q.defer();

			$http
				.delete($rootScope.endPoint + "/task/" + cId + "/" + tId)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Kanban.assignWorker = function(cId, tId, wId) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/worker/" + wId + "/" + cId + "/" + tId)
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
