/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.tourtypes', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('categories.tourtypes', {
          url: '/tourtypes',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ListTourtypesCtrl',
          title: 'Tour Types',
          sidebarMeta: {
            order: 3,
          },
          data: {
            mainmodule: 'tourtypes',
            childmodule: 'view'
          },
        }).state('categories.tourtypes.list', {
          url: '/list',
          templateUrl: 'app/pages/categories/tourtypes/view.html',
          title: 'Tour Types',
          controller: 'ListTourtypesCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('tourtypes', 'view')
          }
        }).state('categories.tourtypes.add', {
          url: '/add',
          templateUrl: 'app/pages/categories/tourtypes/add.html',
          title: 'Tour Types',
          controller: 'AddTourtypesCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('tourtypes', 'create')
          }
        }).state('categories.tourtypes.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/categories/tourtypes/add.html',
          title: 'Tour Types',
          controller: 'EditTourtypesCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('tourtypes', 'update')
          }
        }).state('categories.tourtypes.view', {
          url: '/view/:id',
          templateUrl: 'app/pages/categories/tourtypes/taskdetails.html',
          title: 'Default Tour Task',
          controller: 'ViewTourtypesCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('tourtypes', 'update')
          }
        });
    $urlRouterProvider.when('/categories/tourtypes','/categories/tourtypes/list');
  }
})();