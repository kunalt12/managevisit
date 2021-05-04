/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ApiManagements', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
      $stateProvider
        .state("ApiManagements", {
            url: "/ApiManagements",
            template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
            controller: "ApiManagementsCtrl",
            abstract: !1,
            title: "API Managements",
            sidebarMeta: {
                icon: "fa fa-cog",
                order: 497
            },
            data: {
                mainmodule: "api_managements",
                childmodule: "view"
            },
            resolve: {
                havePermission: checkUserPermission("api_managements", "view")
            }
        }).state("ApiManagements.list", {
            url: "/list",
            templateUrl: "app/pages/ApiManagements/view.html",
            title: "API Managements",
            controller: "ApiManagementsCtrl",
            sidebarMeta: {
                order: 1
            },
            resolve: {
                havePermission: checkUserPermission("api_managements", "view")
            }
        }).state("ApiManagements.add", {
            url: "/add",
            templateUrl: "app/pages/ApiManagements/add.html",
            title: "Add API",
            controller: "AddApiManagementsCtrl",
            sidebarMeta: {
                order: 2
            },
            resolve: {
                havePermission: checkUserPermission("api_managements", "create")
            }
        }).state("ApiManagements.edit", {
            url: "/edit/:id",
            templateUrl: "app/pages/ApiManagements/add.html",
            title: "Edit API",
            controller: "EditApiManagementsCtrl",
            resolve: {
                havePermission: checkUserPermission("api_managements", "update")
            }
        });
    // $urlRouterProvider.when('/users','/users');
  }
})();