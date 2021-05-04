/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
  angular.module('BlurAdmin').factory('authInterceptor', ['$rootScope', '$q', '$window', '$cookies', '$injector', function($rootScope, $q, $window, $cookies, $injector) {

    // angular.module('BlurAdmin').factory('authInterceptor', function ($rootScope, $q, $window, $cookies, $injector) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookies.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },
            response: function (response) {
                var new_token = response.headers('authorization');
                if (new_token != null) {
                    new_token = new_token.replace('Bearer ', '');
                    $cookies.put("token", new_token);
                }

                if (response.status === 200) {
                    return response || $q.when(response);
                }
                else {
                    $rootScope.logout();
                }

            },
            // optional method
            responseError: function (rejection) {
                var $state = $injector.get("$state");
                
                if ($state.current.name != 'login' && rejection.config.url.indexOf('logout') == -1 && rejection.config.url.indexOf('refresh-token') == -1) {
                // if ($state.current.name != 'login' && rejection.status !== 400) {
                    
                    // do something on error
                    if (rejection.status === 400) {
                        $rootScope.logout();
                        return $q.reject(rejection);
                    }

                    /* Validation Error or Server Internal Error handling*/
                    if (rejection.status === 422 || rejection.status === 501) {
                        var new_token = rejection.headers('authorization');
                        if (new_token !== null) {
                            new_token = new_token.replace('Bearer ', '');
                            $cookies.put("token", new_token);
                        }
                        if (rejection.status === 501) {
                            var Notification = $injector.get("Notification");
                            Notification.error(rejection.data.error);
                            $rootScope.logout();
                            return $q.reject(rejection);
                        }
                    }

                    // If the error is 401 related
                    if (rejection.status === 401)
                    {        
                        // We're going to get attempt to refresh the token on the
                        // server, if we're within the ttl_refresh period.
                        var deferred = $q.defer();
                        // We inject $http, otherwise we will get a circular ref

                        $injector.get("AuthenticationFactory").refreshToken().then(function(response){
                            $cookies.put('token', response.data.token);
                            deferred.resolve(response);
                        }, deferred.reject);

                        return deferred.promise.then(function() {
                            return $injector.get("$http")(rejection.config);
                        });
                    }

                    return $q.reject(rejection);
                }

                return $q.reject(rejection);
            }
        };
  }]);
})();