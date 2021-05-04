/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.meals', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('mealsvalue.meals', {
          url: '/meals',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'ListMealsCtrl',
          title: 'Meals',
          sidebarMeta: {
            order: 6,
          },
          data: {
            mainmodule: 'meals',
            childmodule: 'view'
          },
        }).state('mealsvalue.meals.list', {
          url: '/list',
          templateUrl: 'app/pages/categories/meals/view.html',
          title: 'Meals',
          controller: 'ListMealsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('meals', 'view')
          }
        }).state('mealsvalue.meals.add', {
          url: '/add',
          templateUrl: 'app/pages/categories/meals/add.html',
          title: 'Meals',
          controller: 'AddMealsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('meals', 'create')
          }
        }).state('mealsvalue.meals.edit', {
          url: '/edit/:id',
          templateUrl: 'app/pages/categories/meals/add.html',
          title: 'Meals',
          controller: 'EditMealsCtrl',
          sidebarMeta: {
            order: 500,
          },
          resolve: {
              havePermission : checkUserPermission('meals', 'update')
          }
        });
    $urlRouterProvider.when('/categories/meals','/categories/meals/list');
  }
})();