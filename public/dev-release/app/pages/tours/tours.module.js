/**urlRouterProvider
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tours', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tours', {
          url: '/tours',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          controller: 'ListToursCtrl',
          abstract: false,
          title: 'Tours',
          sidebarMeta: {
            icon: 'fa fa-bus',
            order: 4,
          },
          data: {
            mainmodule: 'tours',
            childmodule: 'view'
          },
        }).state('tours.list', {
          url: '/list?id=',
          templateUrl: 'app/pages/tours/view.html',
          title: 'Tours',
          controller: 'ListToursCtrl',
          sidebarMeta: {
            order: 0,
          },
          data: {
            mainmodule: 'tours',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('tours', 'view')
          }
        }).state('tours.add', {
          url: '/add?date=',
          templateUrl: 'app/pages/tours/add.html',
          title: 'Add Tour',
          controller: 'AddToursCtrl',
          sidebarMeta: {
            order: 1,
          },
          data: {
            mainmodule: 'tours',
            childmodule: 'create'
          },
          resolve: {
              havePermission : checkUserPermission('tours', 'create')
          }
        }).state('tours.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/tours/add.html',
          title: 'Tours',
          controller: 'EditToursCtrl',
          data: {
            mainmodule: 'tours',
            childmodule: 'update'
          },
          resolve: {
              havePermission : checkUserPermission('tours', 'update')
          }
      }).state('tours.viewdetails', {
          url: '/view/:id',
          templateUrl: 'app/pages/tours/viewdetails.html',
          title: 'Tour',
          controller: 'ViewToursCtrl',
          data: {
            mainmodule: 'tours',
            childmodule: 'view'
          },
          resolve: {
              havePermission : checkUserPermission('tours', 'view')
          }
      })
      .state('tours.acknowledgedetails', {
          url: '/acknowledge/:id',
          templateUrl: 'app/pages/tours/acknowledge.html',
          title: 'Tours',
          controller: 'AcknowledgeCtrl'
      })
      .state('tours.feedback', {
          url: '/feedback/:id',
          templateUrl: 'app/pages/tours/feedback.html',
          title: 'Tours',
          controller: 'FeedbackCtrl'
      });
    $urlRouterProvider.when('/tours','/tours');
  }
})();