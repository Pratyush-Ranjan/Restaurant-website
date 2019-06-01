var app = angular.module('pind', ["ngRoute"]);
app.config(function($routeProvider){
$routeProvider
	.when("/",{
		templateUrl:"./views/home.ejs"
	})
	.when("/about",{
		templateUrl:"./views/about.ejs",
		controller: "restcontrol"
	})
	.when("/contact",{
		templateUrl: "./views/contact.ejs",
		controller: "restcontrol"
	})
	.when("/menu",{
		templateUrl: "./views/menu.ejs",
		controller: "restcontrol"
	})
	.when("/reservation",{
		templateUrl: "./views/reservation.ejs",
		controller: "restcontrol"
	})
	.when("/gallery",{
		templateUrl: "./views/gallery.ejs",
		controller: "restcontrol"
	})
	.otherwise({
		redirectTo: "/"
	})
});
app.controller('restcontrol',['$scope','$location','$http',function($scope,$location,$http){
$scope.er='';
}]);