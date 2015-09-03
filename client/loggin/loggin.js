(function() {
	"use strict";

	var logginMod = angular.module("logginModule", ["ui.router", "ui.bootstrap", "ngResource"]);


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


	logginMod.controller("logginCtrl", function($scope, logginService) {
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
				}, function(err) {
					console.log(err);
				});
		};
	});
})();
