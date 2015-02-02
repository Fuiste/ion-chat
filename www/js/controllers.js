angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, Users, AuthService, Session) {
      // Form data for the login modal
      $scope.loginData = {};
      $scope.currentUser = null;
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
          $scope.setCurrentUser(null);
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
          $scope.setCurrentUser(user);
          Session.create(user.id, user);
          $scope.closeLogin();
          $scope.setAuth(true);
        }
      };
    })

    .controller('HomeCtrl', function($scope) {
      $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
      ];
    })

    .controller('PlaylistCtrl', function($scope, $stateParams) {
    });
