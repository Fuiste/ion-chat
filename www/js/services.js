/**
 * Created by fuiste on 2/2/15.
 */
angular.module('starter.services', [])
/**
 * A simple example service that returns some fake users.
 */
    .factory('Users', function() {
        // Might use a resource here that returns a JSON array
        // Some fake testing data]

        var users = [{
            id: 0,
            username: 'ben',
            password: 'test',
            name: 'Ben Sparrow',
            notes: 'Enjoys drawing things',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            username: 'max',
            password: 'test',
            name: 'Max Lynx',
            notes: 'Odd obsession with everything',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }];


        return {
            all: function() {
                return users;
            },
            get: function(userId) {
                // Simple index lookup
                return users[userId];
            }
        }
    })

    .factory('AuthService', function (Users, Session, $http) {
        var authService = {};

        // Logs in a user, right now it's not using real data though.
        authService.login = function (credentials) {
            $http.post('http://radiant-waters-1521.herokuapp.com/api/auth/', {email: credentials.username, password: credentials.password}).
                success(function(data, status) {
                    console.log("Logged in user " + data + ", getting their info...");
                    $http.get('http://radiant-waters-1521.herokuapp.com/api/chatters/' + data + '/', {}).
                        success(function(data, status) {
                            console.log(data);
                        }).
                        error(function(data, status) {
                            // TODO: Error
                        })
                }).
                error(function(data, status) {
                    // TODO: Error
                });
            /**
             * TODO: Actual login code eventually
             */
            var usr;
            Users.all().forEach(function(u){
                if(u.username == credentials.username && u.password == credentials.password) {
                    usr = u;
                }
            });
            return usr;
        };

        return authService;
    })

    .service('Session', function () {
        this.getCurrentUser = function() {
          return this.user;
        };
        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };
        this.destroy = function () {
            this.id = null;
            this.user = null;
        };
        return this;
    });
