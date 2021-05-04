/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.contactmanagements', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('contactmanagements', {
          url: '/contactmanagements',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          controller: 'ListContactmanagementsCtrl',
          abstract: false,
          title: 'Contacts',
          sidebarMeta: {
            icon: 'ion-person-stalker',
            order: 3,
          },
          data: {
            mainmodule: 'contactmanagements',
            childmodule: 'view'
          },
        }).state('contactmanagements.list', {
          url: '/list',
          templateUrl: 'app/pages/contactmanagements/view.html',
          title: 'Contacts',
          controller: 'ListContactmanagementsCtrl',
          sidebarMeta: {
            order: 1,
          },
          data: {
            mainmodule: 'contactmanagements',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('contactmanagements', 'view')
          }
        }).state('contactmanagements.add', {
          url: '/add',
          templateUrl: 'app/pages/contactmanagements/add.html',
          title: 'Add Contact',
          controller: 'AddContactmanagementsCtrl',
          sidebarMeta: {
            order: 2,
          },
          data: {
            mainmodule: 'contactmanagements',
            childmodule: 'create'
          },
          resolve: {
              havePermission : checkUserPermission('contactmanagements', 'create')
          }
        }).state('contactmanagements.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/contactmanagements/add.html',
          title: 'Contacts',
          controller: 'EditContactmanagementsCtrl',
          data: {
            mainmodule: 'contactmanagements',
            childmodule: 'update'
          },
          resolve: {
              havePermission : checkUserPermission('contactmanagements', 'update')
          }
      }).state('contactmanagements.viewdetails', {
          url: '/view/:id',
          templateUrl: 'app/pages/contactmanagements/viewdetails.html',
          title: 'Contacts',
          controller: 'ViewContactmanagementsCtrl',
          data: {
            mainmodule: 'contactmanagements',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('contactmanagements', 'view')
          }
      });
    $urlRouterProvider.when('/users','/users');
  }
})();