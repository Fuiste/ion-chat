angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, Users, AuthService, Session) {
      // Form data for the login modal
      $scope.loginData = {};
      $scope.currentUser = Session.user;
      $scope.isAuthorized = false;

      $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
      };

      $scope.setAuth = function(logged) {
        $scope.isAuthorized = logged;
      }

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.loginModal = function() {
        $ionicModal.fromTemplateUrl('templates/login.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      // Log out the current user, then open the logout modal
      $scope.logoutModal = function() {
        $ionicModal.fromTemplateUrl('templates/logout.html', {
          scope: $scope
        }).then(function(modal) {
          //$scope.setCurrentUser(null);
          Session.destroy();
          $scope.setAuth(false);
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

    })

    .controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, Session) {
      // Username and password for the modal
      $scope.credentials = {
        username: '',
        password: ''
      };

      // Calls the AuthService login function
      $scope.login = function (credentials) {
        user = AuthService.login(credentials);
        if(user){
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          //$scope.setCurrentUser(user);
          Session.create(user.id, user);
          $scope.closeLogin();
          $scope.setAuth(true);
          console.log(Session.user.name);
        }
      };
    })

    .controller('HomeCtrl', function($scope, Session) {
    });
