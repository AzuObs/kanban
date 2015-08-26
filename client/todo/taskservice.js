(function() {
	"use strict";

	var taskModule = angular.module("taskModule", ["ngResource"]);

	taskModule.run(function($rootScope) {
		$rootScope.endPoint = "http://localhost:8000/app/tasks/";
	});

	taskModule.service("Task", function($log, $rootScope, $q, $http) {
		var Task = this;
		Task.tasks = {};

		Task.getTasks = function() {
			var defer = $q.defer();

			$http.get($rootScope.endPoint)
				.success(function(res) {
					Task.tasks = res;
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Task.createTask = function(content) {
			var defer = $q.defer();

			$http.post($rootScope.endPoint + content)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Task.editTask = function(id, content) {
			var defer = $q.defer();

			$http.put($rootScope.endPoint + id + "/content/" + content)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		Task.deleteTask = function(id) {
			var defer = $q.defer();

			$http.delete($rootScope.endPoint + id)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		return Task;
	});


})();
