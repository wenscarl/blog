AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com",
	accessKeyId: "",
	secretAccessKey: ""
});

angular.module('app.controller',[
		'ngRoute',
		'app.directive',
		'ngPDFViewer'
	])
	.controller('ResearchController',['$scope', 'DataQuery', function($scope, DataQuery){
		var params = {
			TableName: "research-posts",
			KeyConditionExpression: "#ty = :tttt",
			ExpressionAttributeNames: {
				"#ty": "type"
			},
			ExpressionAttributeValues: {
				":tttt": "research"
			}
		};
		var promise = DataQuery.query(params);
		promise.then(function(data) {
			$scope.posts = data;
		}, function(data) {
			console.log('research data query error！');
		});
	}])
	.controller('ResearchPostController', ['$scope', 'DataQuery', '$routeParams', function($scope, DataQuery, $routeParams){
		var params = {
			TableName: "research-posts",
			KeyConditionExpression: "#ty = :tttt and id = :iiii",
			ExpressionAttributeNames: {
				"#ty": "type"
			},
			ExpressionAttributeValues: {
				":tttt": "research",
				":iiii": parseInt($routeParams.id)
			}
		};
		var promise = DataQuery.query(params);
		promise.then(function(data) {
			$scope.post = data[0];
		}, function(data) {
			console.log('research data query error！');
		});
	}])
	.controller('ResearchNewController', ['$scope', 'DataQuery', '$location', function($scope, DataQuery, $location){
		$scope.newPost = function(){
			var params = {
				TableName: "post-number",
				KeyConditionExpression: "#ty = :tttt",
				ExpressionAttributeNames: {
					"#ty": "type"
				},
				ExpressionAttributeValues: {
					":tttt": "research"
				}
			};
			var promise = DataQuery.query(params);
			promise.then(function(data) {
				var newID = data[0].number;
				var docClient = new AWS.DynamoDB.DocumentClient();
				var researchParams = {
					TableName :"research-posts",
					Item:{
						type: "research",
						id: parseInt(newID),
						title: $scope.title,
						location: $scope.location,
						time: $scope.time,
						content: $scope.content
					}
				};
				docClient.put(researchParams, function(err, data) {
					if (err) {
						console.log("Unable to add research item");
					} else {
						console.log("Put research item succeeded");
						var numberParams = {
							TableName :"post-number",
							Item:{
								type: "research",
								number: parseInt(newID)+1,
							}
						};
						docClient.put(numberParams, function(err, data) {
							if (err) {
								console.log("Unable to update number item");
							} else {
								console.log("Update number item succeeded");
							}
						});
					}
				});
				$location.path('/research-post/'+newID);
			}, function(data) {
				console.log('research post number data query error！');
			});
		}
	}])
	.controller('PublicationController', ['$scope', '$http', function($scope, $http){
		$http.get('data/publications.json').success(function(data){
			$scope.publications = data;
		});
	}])
	.controller('BlogController',['$scope', '$http', function($scope, $http){
		$http.get('data/blog-posts.json').success(function(data){
			$scope.posts = data;
		});
	}])
	.controller('BlogPostController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
		$http.get('data/blog-posts.json').success(function(data){
			$scope.post = data[$routeParams.id];
		});
	}])
    .controller('PdfController', [ '$scope', '$http', 'PDFViewerService', function($scope, $http, pdf) {
		$scope.pdfURL = 'data/CV.pdf';
		$scope.instance = pdf.Instance("viewer");
		$scope.nextPage = function() {
			$scope.instance.nextPage();
		};
		$scope.prevPage = function() {
			$scope.instance.prevPage();
		};
		$scope.gotoPage = function(page) {
			$scope.instance.gotoPage(page);
		};
		$scope.pageLoaded = function(curPage, totalPages) {
			$scope.currentPage = curPage;
			$scope.totalPages = totalPages;
		};
		$scope.loadProgress = function(loaded, total, state) {
			console.log('loaded =', loaded, 'total =', total, 'state =', state);
		};
}]);