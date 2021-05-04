'use strict';

var App = angular.module('BlurAdmin', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.utils',
    'ui.sortable',
    'ui.router',
    'ngRoute',
    'ngTouch',
    'toastr',
    'smart-table',
    "xeditable",
    'ui.slimscroll',
    'ngJsTree',
    'angular-progress-button-styles',
    'datatables', 'datatables.light-columnfilter',
    'validation', 'validation.rule',
    'ui-notification',
    'ngCookies',
    'ivh.treeview',
    'ngDialog',
    'moment-picker', 'angularMoment',
    'ngFileUpload',
    'angucomplete-alt',
    'localytics.directives',
    'cc.autorefresh',
    'jkAngularRatingStars',

    'BlurAdmin.theme',
    'BlurAdmin.pages'
]).filter('fromNow', function() {
    return function(date) {
        return moment(date).fromNow();
    }
});

route_url = document.location.hostname;

apiRoutUrl = 'https://'+ route_url + '/';
var logoURL = apiRoutUrl + 'public/assets/img/newlogo.png';
App.value('base_url', route_url + "/");

var config = {};
config.profile_url = apiRoutUrl + "upload/profile/";
config.api_url = apiRoutUrl + "index.php/api/";

App.constant('$config', config);

var checkLogin = function() {
    return ['$rootScope', '$q', '$cookies', '$state', 'AuthenticationFactory', function($rootScope, $q, $cookies, $state, AuthenticationFactory) {
        var deferred = $q.defer();
        setTimeout(function() {
            var token = $cookies.get("token");
            if (token) {
                if (typeof $rootScope.auth_user == "undefined") {
                    AuthenticationFactory.checkLogin().success(function(response) {
                        $rootScope.auth_user = response;
                        deferred.reject({ goto: 'root' });
                    });
                } else {
                    deferred.reject({ goto: 'root' });
                }
            } else {
                deferred.resolve();
            }
        }, 100);
        return deferred.promise;
    }]
}

var checkUserPermission = function(permissionModule, permission) {
    return ['$rootScope', '$q', '$cookies', '$state', 'AuthenticationFactory', 'Notification', function($rootScope, $q, $cookies, $state, AuthenticationFactory, Notification) {
        var deferred = $q.defer();
        setTimeout(function() {
            var token = $cookies.get("token");
            if (token) {
                if (Object.keys($rootScope.permissions || {}).length) {
                    var access = $rootScope.havePermission(permissionModule, permission);
                    if (!access) {
                        deferred.reject();
                        Notification.error($rootScope.nothavepermission);
                        //  $state.go('dashboard');
                    } else {
                        deferred.resolve();
                    }
                } else {
                    AuthenticationFactory.checkPermission(permission + "." + permissionModule).success(function(response) {
                        $rootScope.permissions = response.permissions;
                        $rootScope.role = response.role;
                        $rootScope.nothavepermission = response.message;

                        if (!response.has_permission) {
                            Notification.error(response.message);
                            $state.go('dashboard');
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                    }).error(function(error) {
                        Notification.error(error.error);
                        deferred.reject();
                        $rootScope.logout();
                    });
                }
            } else {
                deferred.reject();
                $cookies.remove('authUser');
                $cookies.remove('token');
                $state.go("login");
            }
        }, 100);
        return deferred.promise;
    }];
};

App.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'ivhTreeviewOptionsProvider',
    '$validationProvider',
    '$locationProvider',
    'chosenProvider',
    '$sceDelegateProvider',
    function($stateProvider,
        $urlRouterProvider,
        $httpProvider,
        ivhTreeviewOptionsProvider,
        $validationProvider,
        $locationProvider,
        chosenProvider,
        $sceDelegateProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.interceptors.push('authInterceptor');

        // $httpProvider.defaults.headers.common = {};
        // $httpProvider.defaults.headers.post = {};
        // $httpProvider.defaults.headers.put = {};
        // $httpProvider.defaults.headers.patch = {};

        $sceDelegateProvider.resourceUrlWhitelist(['self', /^http?:\/\/(localhost:3000\.)?/]);

        ivhTreeviewOptionsProvider.set({
            idAttribute: 'value',
            labelAttribute: 'description',
            childrenAttribute: 'childern',
            selectedAttribute: 'selected',
            useCheckboxes: true
        });

        $validationProvider.setErrorHTML(function(msg) {
            return "<label style='color:red;' class=\"colorred control-label has-error\">" + msg + "</label>";
        });
        $validationProvider.showSuccessMessage = false; // or true(default)

        /*angular.extend($validationProvider, {
            validCallback: function(element) {
                $(element).parents('.form-group:first').removeClass('has-error');
            },
            invalidCallback: function(element) {
                $(element).parents('.form-group:first').addClass('has-error');
            },
            resetCallback: function(element) {
                $(element).parents('.form-group:first').removeClass('has-error');
            }
        });*/

        chosenProvider.setOption({
            scroll_to_highlighted: false
        });
    }
]);

App.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    editableOptions.submitButtonTitle = 'Submit';
    editableOptions.submitButtonAriaLabel = 'Submit';
    editableOptions.cancelButtonTitle = 'Cancel';
    editableOptions.cancelButtonAriaLabel = 'Cancel';
    editableOptions.clearButtonTitle = 'Clear';
    editableOptions.clearButtonAriaLabel = 'Clear';
});

App.controller('rootCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$state',
    '$cookies',
    'AuthenticationFactory',
    'Notification',
    '$config',
    '$location',
    '$timeout',
    '$injector',
    '$sce',
    '$window',
    'NotificationsFactory',
    function(
        $rootScope,
        $scope,
        $http,
        $state,
        $cookies,
        AuthenticationFactory,
        Notification,
        $config,
        $location,
        $timeout,
        $injector,
        $sce,
        $window,
        NotificationsFactory
    ) {
        $rootScope.state = $state;
        $rootScope.logoImage = 'assets/img/newlogo.png';

        // Set the notification message string limit 
        $rootScope.notification_msg_string_limit = 30;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $("html, body").animate({
                scrollTop: 0
            }, 700);
            
            $rootScope.curState = toState;
            if ($rootScope.state.current.name != "login" && $cookies.get('authUser')) {
                $rootScope.auth_user = JSON.parse($cookies.get('authUser'));

                if (!$rootScope.auth_user.mobile) {
                    $state.go("users.edit-profile");
                }

                // Set Profile image
                if ($rootScope.auth_user.image) {
                    $rootScope.profilePicture = $config.profile_url + $rootScope.auth_user.id + '/' + $rootScope.auth_user.image;
                } else {
                    $rootScope.profilePicture = $config.profile_url + '/noImage.png';
                }
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error && error.goto) {
                $state.go(error.goto, error.params || {});
            }
        });

        $rootScope.permissions = {};

        $scope.toTrustedHTML1 = function(html) {
            return $sce.trustAsHtml(html);
        };

        $rootScope.havePermission = function(permissionModule, permission) {
            var access = (Object.keys($rootScope.permissions || {}).indexOf(permissionModule) !== -1) && $rootScope.permissions[permissionModule][permission];
            return access;
        };


        $rootScope.hasRole = function(role) {
            return (Object.values($rootScope.role || {}).indexOf(role) !== -1);
        };

        $rootScope.makeid = function(value) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789!@#$";

            for (var i = 0; i < value; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        // Call from index.html in head tag in init mode while loading the app.
        // $rootScope.checkForValidCompany = function() {
        //     var company_name = $location.path().split("/")[1];

        //     if (company_name) {
        //         $cookies.put('company_slug', company_name);
        //     }
        //     if ($rootScope.state.current.name != "login" && $cookies.get('authUser')) {
        //         $rootScope.auth_user = JSON.parse($cookies.get('authUser'));
        //         if (company_name !== '' && company_name !== $rootScope.auth_user.company_slug) {
        //             $rootScope.logout();
        //             //$location.path($rootScope.auth_user.company_slug).replace();
        //         }
        //     }
        // };

        var $validationProvider = $injector.get('$validation');
        $scope.checkManualValidation = function(form, name) {
            $validationProvider.validate(form[name]);
        }

        $rootScope.appName = "Tour Management";
        $rootScope.logout = function() {
            var data = {
                "token": $cookies.get('token')
            };

            AuthenticationFactory.logout(data).success(function(res) {
                $cookies.remove('token');
                $cookies.remove('authUser');
                Notification.success(res.message);
                $state.go("login");
            }).error(function(err) {
                $cookies.remove('token');
                $cookies.remove('authUser');
                if (err.error)
                    Notification.success(err.error);
                $state.go("login");
            });
        };

        // $scope.helpText = [];
        // $http.get($config.api_url + 'gethelptext').success(function(data) {
        //     $scope.helpText = data;
        // });

        $scope.helptextData = "";
        $scope.showModal = false;
        $scope.buttonClicked = "";
        $scope.toggleModal = function(btnClicked) {
            for (var i = 0; i < $scope.helpText.length; i++) {
                if ($rootScope.state.current.name == $scope.helpText[i].route_name) {
                    $scope.helptextData = $scope.helpText[i].route_name + " - " + $sce.trustAsHtml($scope.helpText[i].help_text);
                }
            }
            $scope.buttonClicked = btnClicked;
            $scope.showModal = !$scope.showModal;
        };

        $scope.goBack = function() {
            $window.history.back();
        };

        /**
         * Get Notification for header 
         * Call API every 1 min if user have login
         */
        $rootScope.initialise = function() {
            $scope.refreshOpts = {
                interval: 10000,
                paused: false
            };
        }
        $scope.notification_old_count = 0;
        $scope.notification_old_data = [];

        $scope.refreshList = function() {
            console.log("refreshing notifications ----");
            NotificationsFactory.headerNotification().success(function(response) {
                $scope.imagePath = $config.profile_url;
                $scope.dummyImage = $config.profile_url + '/noImage.png';

                if ($scope.notification_old_count != response.count) {
                    $scope.notification_old_data = response.notifications;
                    $scope.notification_old_count = response.count;
                }

                // $scope.notification_old_count = response.count;
            }).error(function(error) {

            });
        };

        $scope.setLastRefreshed = function(eventArgs) {
            $scope.lastRefresh = eventArgs.when;
        }

        // Mark as read to Message or notification
        $scope.markReadTopNotification = function() {
            // $rootScope.initialise();
            $scope.notification_old_count = 0;
            // set the top 10 mark as read 
            NotificationsFactory.markReadNotification().success(function(response) {}).error(function(error) {
                $scope.notification_old_count = 0;
                $scope.notification_old_data = [];
            });
        };
        $rootScope.initialise();


        $scope.randomString = function(length) {
            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var pass = "";
            for (var x = 0; x < length; x++) {
                var i = Math.floor(Math.random() * chars.length);
                pass += chars.charAt(i);
            }
            return pass;
        };
    }
]);
