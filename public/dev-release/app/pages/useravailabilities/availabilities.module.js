/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.useravailabilities', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('availability', {
          url: '/availability',
          templateUrl: 'app/pages/useravailabilities/view.html',
          controller: 'AvailabilitiesCtrl',
          title: 'Availabilities',
          sidebarMeta: {
            icon: 'fa fa-cog',
            order: 499,
          },
          data: {
            mainmodule: 'availabilities',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('availabilities', 'view')
          }
        });
  }
})();