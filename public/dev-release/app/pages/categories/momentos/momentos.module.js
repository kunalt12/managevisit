/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.momentos', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('categories.momentos', {
          url: '/momentos',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ListMomentosCtrl',
          title: 'Momentos',
          sidebarMeta: {
            order: 6,
          },
          data: {
            mainmodule: 'momentos',
            childmodule: 'view'
          },
        }).state('categories.momentos.list', {
          url: '/list',
          templateUrl: 'app/pages/categories/momentos/view.html',
          title: 'Momentos',
          controller: 'ListMomentosCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('momentos', 'view')
          }
        }).state('categories.momentos.add', {
          url: '/add',
          templateUrl: 'app/pages/categories/momentos/add.html',
          title: 'Momento',
          controller: 'AddMomentosCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('momentos', 'create')
          }
        }).state('categories.momentos.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/categories/momentos/add.html',
          title: 'Momento',
          controller: 'EditMomentosCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('momentos', 'update')
          }
        });
    $urlRouterProvider.when('/categories/momentos','/categories/momentos/list');
  }
})();