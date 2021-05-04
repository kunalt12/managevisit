/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.forgotpassword', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('forgotpassword', {
                url: '/forgot-password',
                title: 'Forgot Password',
                templateUrl: 'app/pages/forgotpassword/view.html',
                controller: 'ForgotPasswordCtrl'
            }).state({
              name: 'reset-password',
              url: '/password/reset/:token',
              templateUrl: 'app/pages/forgotpassword/reset.html',
              controller: 'ResetPasswordCtrl'
          });
  }
})();