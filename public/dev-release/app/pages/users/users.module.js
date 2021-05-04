/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users', ['ui.select', 'ngSanitize'])
      .config(routeConfig);
  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('users', {
          url: '/users',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          controller: 'UsersCtrl',
          abstract: false,
          title: 'Users',
          data: {
            mainmodule: 'users',
            childmodule: 'view'
          },
          sidebarMeta: {
            icon: 'ion-person-stalker',
            order: 2,
          }          
        }).state('users.list', {
          url: '/list',
          templateUrl: 'app/pages/users/view.html',
          title: 'Users',
          controller: 'UsersCtrl',
          sidebarMeta: {
            order: 1,
          },
          resolve: {
              havePermission : checkUserPermission('users', 'view')
          }
        }).state('users.add', {
          url: '/add',
          templateUrl: 'app/pages/users/add.html',
          title: 'Add User',
          controller: 'AddUsersCtrl',
          sidebarMeta: {
            order: 2,
          },
          resolve: {
              havePermission : checkUserPermission('users', 'create')
          }
        }).state('users.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/users/add.html',
          title: 'User',
          controller: 'EditUsersCtrl',
          resolve: {
              havePermission : checkUserPermission('users', 'update')
          }
        }).state('users.viewdetails', {
          url: '/view/:id',
          templateUrl: 'app/pages/users/viewdetails.html',
          title: 'User',
          controller: 'ViewUsersCtrl',
          resolve: {
              havePermission : checkUserPermission('users', 'view')
          }
        }).state('users.edit-profile', {
          url: '/editprofile',
          templateUrl: 'app/pages/users/editprofile.html',
          title: 'Profile',
          controller: 'editProfileCtrl',
          data: {
            mainmodule: 'users',
            childmodule: 'editprofile'
          },
          resolve: {
              havePermission : checkUserPermission('users', 'editprofile')
          }
        });
    $urlRouterProvider.when('/users','/users');
  }
})();