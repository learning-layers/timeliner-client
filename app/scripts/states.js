angular.module('timelinerApp').config(function($stateProvider, $urlRouterProvider){

  // For any unmatched url, send to /
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        $title: function() { return 'Welcome'; }
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      resolve: {
        $title: function() { return 'About'; }
      }
    })

});
