var app = angular.module('pind', ["ngRoute"]);
app.config(function($routeProvider){
$routeProvider
	.when("/",{
		templateUrl:"./views/home.ejs",
		resolve : ['auth',
		function(auth) {
			auth.islogin();
		}]
	})
	.when("/about",{
		templateUrl:"./views/about.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.islogin();
		}]
	})
	.when("/contact",{
		templateUrl: "./views/contact.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.islogin();
		}]
	})
	.when("/reservation",{
		templateUrl: "./views/reservation.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.islogin();
		}]
	})
	.when("/gallery",{
		templateUrl: "./views/gallery.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.islogin();
		}]
	})
	.when("/user",{
		templateUrl:"./views/user.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.isloggedin();
		}]
	})
	.when("/menu",{
		templateUrl:"./views/menu.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.checklogin();
		}]
	})
	.when("/cart",{
		templateUrl:"./views/cart.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.checklogin();
			auth.iscart();
		}]
	})
	.when("/checkout",{
		templateUrl:"./views/checkout.ejs",
		controller: "restcontrol",
		resolve : ['auth',
		function(auth) {
			auth.ischeck();
			auth.checklogin();
			auth.iscart();
		}]
	})
	.otherwise({
		redirectTo: "/"
	})
});
app.factory('auth', ['$http','$location', '$rootScope',
function($http, $location, $rootScope) {
	var auth = {};
auth.checklogin = function() {
	$http.get('/loggedin')
	.success(function(response)
 	{ 
 	if (response === '0') 
 	   { $location.path("/user"); 
 		} 
 	else
 	{
 		$rootScope.currentUser = response;
 	}
 		});
 }; 
 auth.isloggedin = function() {
	$http.get('/loggedin')
	.success(function(response)
 	{ 
 	if (response !== '0') 
 	   {  $rootScope.currentUser = response;
 	   	  $location.path("/menu"); 
 		} 
 		});
 };
 auth.islogin = function() {
	$http.get('/loggedin')
	.success(function(response)
 	{ 
 	if (response !== '0') 
 	   {  $rootScope.currentUser = response;
 		} 
 		});
 }; 
 auth.iscart = function() {
	$http.get('/cart/'+$rootScope.currentUser.username)
	.success(function(response)
 	{
 	   $rootScope.existuser = response;
 		});
 };
 auth.ischeck = function() {
	$http.get('/checkoutcart')
	.success(function(response)
 	{
 	  if(response === '0')
 	  	$location.path("/menu");
 	});
 };  
	return auth;
}]);
app.controller('restcontrol',['$scope','$location','$http','$rootScope',function($scope,$location,$http,$rootScope){
$scope.user={};
$scope.products=[];
$scope.er='';
$scope.errorlogin='';
$scope.cart={};
$scope.register = function() {
		if($scope.user.rpassword===$scope.user.rrpassword)
		{
			if($scope.user.rpassword.length > 6)
			{
				$scope.er='';
				$http.post('/register', $scope.user)
				.error(function(error) {
				$scope.er = 'username already taken';
				})
        		.success(function(response) {
          		$rootScope.currentUser = response;
          		$location.path("/menu");
       			 });
			} 
			else
				$scope.er='Password is weak';
		}
		else
			$scope.er='Password is not same';
	};
$scope.logIn = function() {
    $http.post('/login', $scope.user)
    .error(function(error) {
			$scope.errorlogin='Invalid credentials';
		})
      .success(function(response) {
        $rootScope.currentUser = response;
        $location.path("/menu");
      });
  };
	$scope.logout = function() {
    $http.post("/logout")
      .success(function() {
        $rootScope.currentUser = null;
        $location.path("/");
      });
  };
  $http.get('/api/products')
		.success(function(data) {
			$scope.products=data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	$scope.incrementitem = function(item)
		 {
			$scope.itm=({
   		 itemname: item.title,
   		 quantity: item.quantity,
 		 });
			$http.post('/api/itemquantinc', $scope.itm)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	$scope.decrementitem = function(item)
		 {
			$scope.itm=({
   		 itemname: item.title,
   		 quantity: item.quantity,
 		 });
			$http.post('/api/itemquantdec', $scope.itm)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	$scope.removeItem = function(itemid){
 		 $http.post('/api/removeItem/'+$rootScope.currentUser.username+'/'+itemid)
		.success(function(data) {
			$rootScope.existuser= data;
			$http.get('/cart/'+$rootScope.currentUser.username)
	.success(function(response)
 	{
 	   $rootScope.existuser = response;
 		});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	$scope.reduceItem = function(itemid){
 		 $http.post('/api/reduceItem/'+$rootScope.currentUser.username+'/'+itemid)
		.success(function(data) {
			$rootScope.existuser= data;
			$http.get('/cart/'+$rootScope.currentUser.username)
	.success(function(response)
 	{
 	   $rootScope.existuser = response;
 		});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	$scope.addtocart = function(item){
 		 $scope.it=({
 		 itemid:item._id,
 		 });
 		 $http.post('/api/additem/'+$rootScope.currentUser.username,$scope.it)
		.success(function(data) {
			$rootScope.existuser= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
}]);