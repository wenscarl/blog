angular.module('app.directive',[])
	.directive('navigationbar', [function(){
		return{
			controller: ['$scope', '$http', function($scope, $http){
				$http.get('data/pages.json').success(function(data){
					$scope.pages = data;
				});
			}],
			restrict: 'E',
			templateUrl: 'modules/navigationbar.html',
			//link: function($scope, iElm, iAttrs, controller){}
		};
	}])
	.directive('info', [function(){
		return{
			controller: ['$scope', '$http', function($scope, $http){
				$http.get('data/info.json').success(function(data){
					$scope.info = data;
				});
			}],
			restrict: 'E',
			templateUrl: 'modules/info.html',
		};
	}]);