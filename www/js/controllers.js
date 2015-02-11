angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, Users, Session, $cordovaPush, $cordovaDialogs) {
      // Form data for the login modal
      $scope.loginData = {};
      $scope.currentUser = null;
      $scope.isAuthorized = false;
      $scope.notifications = [];
      $scope.fromEmail = '';

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
          console.log("Opened the login modal.");
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

      // Open the login modal
      $scope.pingModal = function(email) {
        $scope.fromEmail = email;
        $ionicModal.fromTemplateUrl('templates/ping.html', {
          scope: $scope
        }).then(function(modal) {
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

      /**
       * Push helpers
       */

      // Notification Received
      $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        console.log(JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
          //TODO: Android
        }
        else if (ionic.Platform.isIOS()) {
          console.log("iOS");
          $scope.updateMessages();
          $scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.alert));
          })
        }
      });

      $scope.updateMessages = function() {
        $http.get('http://radiant-waters-1521.herokuapp.com/api/update/', {
          user_id: $scope.currentUser.id
        }).
            success(function(resp, status){
              console.log("Messages updated");
              var usr = $scope.currentUser;
              usr.messageHistory = resp.messageHistory;
              $scope.setCurrentUser(usr);
            }).
            error(function(resp, status){
              //TODO: Error
            });
      };
    })

    .controller('PingController', function($scope, $rootScope, $http) {
      $scope.payload = {
        username: $scope.fromEmail,
        message: ''
      };

      $scope.pingError = false;

      $scope.ping = function (payload) {
        if (payload.message === '') {
          $scope.pingError = true;
        } else {
          $http.post('http://radiant-waters-1521.herokuapp.com/api/messages/', {
            username: payload.username,
            userfrom: $scope.currentUser.email,
            message: payload.message
          }).
              success(function(user, status) {
                $scope.pingError = false;
                $scope.closeLogin();
                console.log(user);
              }).
              error(function(data, status) {
                // TODO: Handle errors
              });
        }
      }
    })

    .controller('CreateController', function ($scope, $rootScope, $http, AUTH_EVENTS, Session, $cordovaPush) {
      $scope.credentials = {
        fullName: '',
        email: '',
        imgLink: '',
        password: '',
        confirmPassword: ''
      };

      $scope.passError = false;

      $scope.createAccount = function (credentials) {
        if (credentials.password !== credentials.confirmPassword){
          $scope.passError = true;
          credentials.password = '';
          credentials.confirmPassword = '';
        } else {
          $http.post('http://radiant-waters-1521.herokuapp.com/api/chatters/', {
            full_name: credentials.fullName,
            email: credentials.email,
            password: credentials.password,
            imgur_url: credentials.imgLink,
            groups: [],
            user_permissions: []
          }).
              success(function(user, status) {
                $scope.passError = false;
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

    .controller('LoginController', function ($ionicPush, $scope, $rootScope, $http, AUTH_EVENTS, Session) {
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
        console.log('logging in...');
        $http.post('http://radiant-waters-1521.herokuapp.com/api/auth/', {
          email: credentials.username,
          password: credentials.password
        }).
            success(function(user, status) {
              user.fullName = user.full_name;
              user.imgurUrl = user.imgur_url;
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(user);
              Session.create(user.id, user);
              $scope.closeLogin();
              $scope.setAuth(true);

              $ionicPush.init($scope.currentUser.id);
            }).
            error(function(data, status) {
              console.log(data);
              console.log(status);
              // TODO: Error
            });
      };
    })

    .controller('HomeCtrl', function($scope) {
      $scope.reply = function(email) {
        $scope.pingModal(email);
      };
    });
