(function() {
	"use strict";

	var kanbanMod = angular.module("kanbanBoardModule", ["ui.sortable", "userServiceModule"]);


	kanbanMod.config(function($stateProvider) {
		$stateProvider.state("kanban.board", {
			url: "/board/:boardId",
			templateUrl: "/kanban/templates/kanban.board.html",
			controller: "kanbanBoardCtrl",
			resolve: {
				userObj: function(userService) {
					return userService.getUser();
				},
				boardId: function($stateParams) {
					return $stateParams.boardId;
				}
			}
		});
	});


	kanbanMod.directive("uiCategory", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.category.html"
		};
	});


	kanbanMod.directive("uiTask", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.task.html"
		};
	});


	kanbanMod.directive("uiWorker", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "kanban/templates/kanban.worker.html"
		};
	});


	kanbanMod.controller("kanbanBoardCtrl", function($scope, $log, $modal, userObj, boardId, userService) {
		$scope.user = userObj;
		$scope.board = $scope.user.boards[findBoardIndex(boardId)];
		var boardWorkers = $scope.board.workers.slice();

		$scope.createCategory = function(name, keyEvent) {
			if (!keyEvent || keyEvent.which === 13) {
				$scope.newCat = "";

				var params = {
					userId: $scope.user._id,
					boardId: $scope.board._id,
					name: name,
					position: $scope.board.categories.length
				};

				userService
					.createCategory(params)
					.then(function(res) {
						$scope.board.categories.push(res);
					}, function(err) {
						$log.log(err);
					});
			}
		};

		$scope.deleteCategory = function(catId) {
			userService
				.deleteCategory($scope.board._id, catId)
				.then(function(res) {
					for (var i = 0; i < $scope.board.categories.length; i++) {
						if ($scope.board.categories[i]._id === catId) {
							$scope.board.categories.splice(i, 1);
						}
					}
				}, function(err) {
					$log.log(err);
				});
		};

		$scope.createTask = function(name, catId, keyEvent) {
			if (!keyEvent || keyEvent.which === 13) {
				$scope.newTask = "";
				var category;

				for (var i = 0; i < $scope.board.categories.length; i++) {
					if ($scope.board.categories[i]._id === catId) {
						category = $scope.board.categories[i];
					}
				}

				var params = {
					userId: $scope.user._id,
					boardId: $scope.board._id,
					categoryId: catId,
					name: name,
					position: category.tasks.length
				};

				userService
					.createTask(params)
					.then(function(res) {
						category.tasks.push(res);
					}, function(err) {
						$log.log(err);
					});
			}
		};

		$scope.deleteTask = function(catId, taskId) {
			var category;

			for (var i = 0; i < $scope.board.categories.length; i++) {
				if ($scope.board.categories[i]._id === catId)
					category = $scope.board.categories[i];
			}

			userService
				.deleteTask(catId, taskId)
				.then(function(res) {
					for (var i = 0; i < category.tasks.length; i++) {
						if (category.tasks[i]._id === taskId) {
							category.tasks.splice(i, 1);
						}
					}
				}, function(err) {
					$log.log(err);
				});
		};


		$scope.updateCategories = function() {
			userService
				.updateCategories()
				.then(function(res) {
					$scope.board.categories = res;
				}, function(err) {
					$log.log(err);
				});
		};


		$scope.taskSortOptions = {
			placeholder: ".task",
			connectWith: ".task-list",
			stop: function(e, ui) {
				$scope.updateCategories();
			}
		};


		$scope.categorySortOptions = {
			// placeholder: ,
			stop: function(e, ui) {
				$scope.updateCategories();
			}
		};

		$scope.workerSortOpts = {
			placeholder: "task",
			connectWith: ".worker-list",
			stop: function(e, ui) {
				// clone worker and allocate him
				if ($(e.target).hasClass('worker-selection') &&
					ui.item.sortable.droptarget &&
					e.target != ui.item.sortable.droptarget[0]) {
					var ids = ui.item.sortable.droptarget[0].id;
					var cId = ids.substring(2, ids.search(" "));
					var tId = ids.substring(ids.search("t:") + 2, ids.length);
					var wId = ui.item.sortable.model._id;

					$scope.user.workers = boardWorkers.slice();
					$scope.updateCategories();
				}
			}
		};


		//find index of board in user
		function findBoardIndex(boardId) {
			for (var i = 0; i < $scope.user.boards.length; i++) {
				if ($scope.user.boards[i]._id === boardId) {
					return i;
				}
			}
		}

		$scope.taskModal = function(_user, _board, _cat, _task) {
			var modalInstance = $modal.open({
				animation: true,
				size: "md",
				templateUrl: 'kanban/templates/kanban.comments.html',
				controller: 'kanbanCommentsController',
				resolve: {
					user: function() {
						return _user;
					},
					board: function() {
						return _board;
					},
					cat: function() {
						return _cat;
					},
					task: function() {
						return _task;
					}
				}
			});
		};

	});


	kanbanMod.controller("kanbanCommentsController",
		function($scope, $modalInstance, $log, userService, user, board, cat, task) {
			$scope.task = task;
			$scope.category = cat;

			$scope.closeModal = function() {
				$modalInstance.dismiss();
			};


			$scope.createComment = function(keyEvent) {
				if (!keyEvent || keyEvent.which === 13) {
					var params = {
						content: $scope.commentInput,
						userId: user._id,
						catId: cat._id,
						boardId: board._id,
						taskId: $scope.task._id
					};

					userService
						.createComment(params)
						.then(function(res) {
							$scope.task.comments.push(res);
						}, function(err) {
							$log.log(err);
						});
				}
			};

			$scope.ageOfPost = function(t) {
				console.log(t);
				return "5 minutes old";
			};
		});

})();
