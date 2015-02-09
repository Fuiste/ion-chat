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
      $scope.pingModal = function() {
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
    })

    .controller('PingController', function($scope, $rootScope, $http) {
      $scope.payload = {
        username: '',
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

                //Register for push
                var iosConfig = {
                  "badge": true,
                  "sound": true,
                  "alert": true
                };

                console.log('PUSH: Connecting to push api');

                $cordovaPush.register(iosConfig).then(function(result) {
                  console.log("Registered?");

                  // Success -- send deviceToken to server, and store
                  var req = {
                    method: 'POST',
                    url: api + "https://push.ionic.io/api/v1/register-device-token",
                    headers: {
                      'X-Ionic-Applicaton-Id': $ionicApp.getId(),
                      'X-Ionic-API-Key': $ionicApp.getApiKey()
                    },
                    data: {
                      ios_token: token,
                      metadata: {
                        user_id: $scope.currentUser.id
                      }
                    }
                  };

                  $http(req)
                      .success(function(data, status) {
                        console.log("Success: " + data);
                      })
                      .error(function(error, status, headers, config) {
                        console.log("Error: " + error + " " + status + " " + headers);
                      });
                });
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
        console.log('logging in...');
        $http.post('http://radiant-waters-1521.herokuapp.com/api/auth/', {
          email: credentials.username,
          password: credentials.password
        }).
            success(function(user, status) {
              console.log('net call success!');
              user.fullName = user.full_name;
              user.imgurUrl = user.imgur_url;
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $scope.setCurrentUser(user);
              Session.create(user.id, user);
              $scope.closeLogin();
              $scope.setAuth(true);
            }).
            error(function(data, status) {
              console.log(data);
              console.log(status);
              // TODO: Error
            });
      };
    })

    .controller('HomeCtrl', function($scope, $http, Session) {
      $scope.pushRegister = function() {
        var req = {
          method: 'POST',
          url: "https://push.ionic.io/api/v1/register-device-token",
          headers: {
            'X-Ionic-Applicaton-Id': "2074701c",
            'X-Ionic-API-Key': "f11c8c924f90f52df5679b206159f97"
          },
          data: {
            ios_token: token,
            metadata: {
              userid: 101,
              firstname: 'John'
            }
          }
        };
        $http(req)
            .success(function(data, status) {
              alert("Success: " + data);
            })
            .error(function(error, status, headers, config) {
              alert("Error: " + error + " " + status + " " + headers);
            });
      }
    });
