/**
 * Created by fuiste on 2/2/15.
 */
angular.module('starter.constants', [])
/**
 * Authentication events, pretty self-explanatory
 */
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });