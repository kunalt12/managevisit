/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.visitors', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('categories.visitors', {
          url: '/visitors',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ListVisitorsCtrl',
          title: 'Visitor Types',
          sidebarMeta: {
            order: 5,
          },
          data: {
            mainmodule: 'visitors',
            childmodule: 'view'
          },
        }).state('categories.visitors.list', {
          url: '/list',
          templateUrl: 'app/pages/categories/visitors/view.html',
          title: 'Visitor Types',
          controller: 'ListVisitorsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('visitors', 'view')
          }
        }).state('categories.visitors.add', {
          url: '/add',
          templateUrl: 'app/pages/categories/visitors/add.html',
          title: 'Visitor Types',
          controller: 'AddVisitorsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('visitors', 'create')
          }
        }).state('categories.visitors.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/categories/visitors/add.html',
          title: 'Visitor Types',
          controller: 'EditVisitorsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('visitors', 'update')
          }
        });
    $urlRouterProvider.when('/categories/visitors','/categories/visitors/list');
  }
})();