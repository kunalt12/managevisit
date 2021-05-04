/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.notifications', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('notifications', {
          url: '/notifications',
          templateUrl: 'app/pages/notifications/view.html',
          controller: 'NotificationsCtrl',
          title: 'Notifications',
          sidebarMeta: {
            icon: 'fa fa-bell',
            order: 498,
          },
          data: {
            mainmodule: 'notifications',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('notifications', 'view')
          }
        });
  }
})();