
var musiksalenApp = angular.module('musiksalen', ['ngRoute','ngResource', 'ngAnimate', 'ngCookies','angular.filter', 'ngSanitize', 'firebase', 'hm.readmore']);

//This function is called when the google api has finished loading. InitGapi will only be called if defined as a function
var init = function() {

  if(typeof(window.initGapi) === typeof(Function)){
    window.initGapi();
  }
}

musiksalenApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/works/:workId', {
        templateUrl: 'partials/works.html',
        controller: 'WorksCtrl'
      }).
      when('/artists',{
        templateUrl: 'partials/artists.html',
        controller: 'ArtistsCtrl'
      }).
      when('/artists/:artistId',{
        templateUrl: 'partials/singleArtist.html',
        controller: 'SingleArtistCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'
      }).
      when('/myAccount', {
        templateUrl: 'partials/myAccount.html',
        controller: 'MyAccountCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);