(function() {

	var errorHandlerModule = angular.module("errorHandlerModule", []);

	errorHandlerModule.service("errHandler", function($log, $state) {
		return {
			err: function(err) {
				switch (err) {
					case "Unauthorized":
						$log.error("errH: 401 unauthorized");
						$state.go("loggin");
						break;

					case "Not Found":
						$log.error("errH: 404 not found");
						$state.go("loggin");
						break;

					default:
						$log.warn("errH default (no methods) for: %s", err);
						break;
				}
			}
		};
	});
})();
