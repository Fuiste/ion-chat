angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, Users, Session) {
      // Form data for the login modal
      $scope.loginData = {};
      $scope.currentUser = null;
      $scope.isAuthorized = false;

      /**
       * Setters
       */

      // Setter for the active user, 'very' secure
      $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
      };

      // Setter for current auth status
      $scope.setAuth = function(logged) {
        $scope.isAuthorized = logged;
      }

      /**
       * Modal controls
       */

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

      // Show the user account creation modal
      $scope.createModal = function() {
        $ionicModal.fromTemplateUrl('templates/create.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

    })

    .controller('CreateController', function ($scope, $rootScope, $http, AUTH_EVENTS, Session) {
      $scope.credentials = {
        fullName: '',
        email: '',
        imgLink: '',
        password: '',
        confirmPassword: ''
      };

      $scope.passError = false;

      $scope.create = function (credentials) {
        if (credentials.password != credentials.confirmPassword){
          $scope.passError = true;
          credentials.password = '';
          credentials.confirmPassword = '';
        } else {
          $http.post('http://radiant-waters-1521.herokuapp.com/api/chatters/', {
            fullName: credentials.fullName,
            email: credentials.username,
            password: credentials.password,
            imgurUrl: credentials.imgLink
          }).
              success(function(user, status) {
                user.fullName = user.full_name;
                user.imgurUrl = user.imgur_url;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
                Session.create(user.id, user);
                $scope.closeLogin();
                $scope.setAuth(true);
              }).
              error(function(data, status) {
                // TODO: Handle server errors
              });
        }

      };
    })

    .controller('LoginController', function ($scope, $rootScope, $http, AUTH_EVENTS, Session) {
      // Username and password for the modal
      $scope.credentials = {
        username: '',
        password: ''
      };

      // Calls the AuthService login function
      $scope.login = function (credentials) {
        /**
         * User structure, yo!
         * {id: x, email: y, fullName: z}
         */
        $http.post('http://radiant-waters-1521.herokuapp.com/api/auth/', {email: credentials.username, password: credentials.password}).
            success(function(user, status) {
              user.fullName = user.full_name;
              user.imgurUrl = user.imgur_url;
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(user);
              Session.create(user.id, user);
              $scope.closeLogin();
              $scope.setAuth(true);
            }).
            error(function(data, status) {
              // TODO: Error
            });
      };
    })

    .controller('HomeCtrl', function($scope, Session) {
    });
