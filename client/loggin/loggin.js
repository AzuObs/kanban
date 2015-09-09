(function() {
	"use strict";

	var logginMod = angular.module("logginModule", ["ngResource"]);


	logginMod.service("logginService", function($http, $rootScope, $q) {
		var service = this;

		service.authenticate = function(params) {
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

		return service;
	});


	logginMod.controller("logginCtrl", function($scope, logginService, $state) {
		$scope.username = "daniel";
		$scope.pwd = "123";

		$scope.authenticate = function() {
			logginService
				.authenticate({
					username: $scope.username,
					pwd: $scope.pwd
				})
				.then(function(res) {
					sessionStorage.token = res.token;
					$state.go("kanban.boardlist", {
						username: $scope.username
					});
				}, function(err) {
					console.log(err);
				});
		};
	});
})();
