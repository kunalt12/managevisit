/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.transports', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('categories.transports', {
          url: '/transports',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ListTransportsCtrl',
          title: 'Transports',
          sidebarMeta: {
            order: 1,
          },
          data: {
            mainmodule: 'transports',
            childmodule: 'view'
          },
        }).state('categories.transports.list', {
          url: '/list',
          templateUrl: 'app/pages/categories/transports/view.html',
          title: 'Transports',
          controller: 'ListTransportsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('transports', 'view')
          }
        }).state('categories.transports.add', {
          url: '/add',
          templateUrl: 'app/pages/categories/transports/add.html',
          title: 'Transports',
          controller: 'AddTransportsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('transports', 'create')
          }
        }).state('categories.transports.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/categories/transports/add.html',
          title: 'Transports',
          controller: 'EditTransportsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('transports', 'update')
          }
        });
    $urlRouterProvider.when('/categories/transports','/categories/transports/list');
  }
})();