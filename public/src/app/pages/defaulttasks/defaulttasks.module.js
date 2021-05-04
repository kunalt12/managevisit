/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.defaulttasks', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('defaulttasks', {
          url: '/defaulttasks',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          controller: 'ListDefaulttasksCtrl',
          abstract: false,
          title: 'Default Tour Tasks',
          sidebarMeta: {
            icon: 'ion-person-stalker',
            order: 10,
          },
        }).state('defaulttasks.list', {
          url: '/list',
          templateUrl: 'app/pages/defaulttasks/view.html',
          title: 'Default Tour Tasks',
          controller: 'ListDefaulttasksCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('defaulttasks', 'view')
          }
        }).state('defaulttasks.add', {
          url: '/add',
          templateUrl: 'app/pages/defaulttasks/add.html',
          title: 'Default Tour Tasks',
          controller: 'AddDefaulttasksCtrl',
          resolve: {
              havePermission : checkUserPermission('defaulttasks', 'create')
          }
        }).state('defaulttasks.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/defaulttasks/add.html',
          title: 'Default Tour Tasks',
          controller: 'EditDefaulttasksCtrl',
          resolve: {
              havePermission : checkUserPermission('defaulttasks', 'update')
          }
      })/*.state('defaulttasks.viewdetails', {
          url: '/view/:id',
          templateUrl: 'app/pages/defaulttasks/viewdetails.html',
          title: 'Default Tour Tasks',
          controller: 'ViewDefaulttasksCtrl',
          resolve: {
              havePermission : checkUserPermission('defaulttasks', 'view')
          }
      })*/;
    $urlRouterProvider.when('/defaulttasks','/defaulttasks');
  }
})();