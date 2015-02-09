// Rudy's ionic starter app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.constants', 'ionic.service.core', 'ionic.service.push'])

    .config(['$ionicAppProvider', function($ionicAppProvider) {
        // Identify app
        $ionicAppProvider.identify({
            // Your App ID
            app_id: '92e87c0b',
            // The API key all services will use for this app
            api_key: 'c34a09a9d3a5fbbdda83078daef693806d15d3435b2996ee'
        });

    }])

    .run(function($ionicPlatform, $ionicApp) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

          console.log($ionicApp.getApp());
      });
    })

    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
          })

          .state('app.about', {
            url: "/about",
            views: {
              'menuContent': {
                templateUrl: "templates/about.html"
              }
            }
          })

          .state('app.browse', {
            url: "/browse",
            views: {
              'menuContent': {
                templateUrl: "templates/browse.html"
              }
            }
          })
          .state('app.home', {
            url: "/home",
            views: {
              'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'
              }
            }
          });

      $urlRouterProvider.otherwise('/app/home');
    });
