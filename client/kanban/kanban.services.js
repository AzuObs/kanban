(function() {
	"use strict";

	var kanbanServices = angular.module("kanban.services", ["ngResource"]);

	kanbanServices.run(function($rootScope) {
		$rootScope.endPoint = "http://localhost:8000/api";
	});

	kanbanServices.service("userService", function($log, $rootScope, $q, $http) {
		var User = this;
		User.user = {};

		User.authenticate = function(params) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/user/loggin", params)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};


		User.getUser = function() {
			var userId = "55e75220559835a1048b0291";
			var defer = $q.defer();

			$http
				.get($rootScope.endPoint + "/user/" + userId)
				.success(function(res) {
					buildTaskWorkers(res);
					User.user = res;
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		User.createCategory = function(params) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/category", params)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		User.deleteCategory = function(boardId, catId) {
			var defer = $q.defer();

			$http
				.delete($rootScope.endPoint + "/category/" + User.user._id + "/" + boardId + "/" + catId)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		User.createTask = function(params) {
			var defer = $q.defer();

			$http
				.post($rootScope.endPoint + "/task/", params)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		User.deleteTask = function(cId, tId) {
			var defer = $q.defer();
			var userId = User.user._id;
			var boardId = User.user.boards[0]._id;

			$http
				.delete($rootScope.endPoint + "/task/" + userId + "/" + boardId + "/" + cId + "/" + tId)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		User.updateCategories = function() {
			var defer = $q.defer();
			var params = {
				userId: User.user._id,
				boardId: User.user.boards[0]._id,
				categories: User.user.boards[0].categories
			};

			$http
				.put($rootScope.endPoint + "/categories", params)
				.success(function(res) {
					defer.resolve(res);
				})
				.error(function(err) {
					defer.reject(err);
				});

			return defer.promise;
		};

		var buildTaskWorkers = function(res) {
			for (var i = 0; i < res.boards.length; i++) {
				for (var x = 0; x < res.boards[i].categories.length; x++) {
					for (var y = 0; y < res.boards[i].categories[x].tasks.length; y++) {
						for (var z = 0; z < res.boards[i].categories[x].tasks[y].workers.length; z++) {
							var workerId = res.boards[i].categories[x].tasks[y].workers[z];
							for (var xi = 0; xi < res.boards[i].workers.length; xi++) {
								if (workerId === res.boards[i].workers[xi]._id) {
									res.boards[i].categories[x].tasks[y].workers[z] = res.boards[i].workers[xi];
								}
							}
						}
					}
				}
			}
		};
	});
})();
