angular.module('app',[
	'ngRoute',
	'app.controller'
	])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			//controller: 'HomeController'
		}).when('/research', {
			templateUrl: 'views/research.html',
			controller: 'ResearchController'
		}).when('/research-post/:id', {
			templateUrl: 'views/research-post.html',
			controller: 'ResearchPostController'
		}).when('/research/new', {
			templateUrl: 'admin/research-new.html',
			controller: 'ResearchNewController'
		}).when('/research-post/:id/edit', {
			templateUrl: 'admin/research-edit.html',
			controller: 'ResearchPostController'
		}).when('/publications', {
			templateUrl: 'views/publications.html',
			controller: 'PublicationController'
		}).when('/blog', {
			templateUrl: 'views/blog.html',
			controller: 'BlogController'
		}).when('/blog-post/:id', {
			templateUrl: 'views/blog-post.html',
			controller: 'BlogPostController'
		}).when('/miscellaneous', {
			templateUrl: 'views/miscellaneous.html',
			//controller: 'PostController'
		}).when('/cv', {
			templateUrl: 'views/cv.html',
			controller: 'PdfController'
		}).otherwise({
			redirectTo: '/'
		});
	}])
	.factory('DataQuery', ['$http', '$q', function ($http, $q) {
		return {
			query : function(params) {
				var deferred = $q.defer();
				var docClient = new AWS.DynamoDB.DocumentClient();
				docClient.query(params, function (err, data) {
					if (err) {
						deferred.reject(data);
						console.log("Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2));
					} else {
						deferred.resolve(data.Items);
					}
				});
				return deferred.promise;
			}
		};
	}]);