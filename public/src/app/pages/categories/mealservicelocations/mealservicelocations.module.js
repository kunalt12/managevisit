/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealservicelocations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("mealsvalue.mealservicelocations", {
                url: "/mealservicelocations",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListMealservicelocationsCtrl",
                title: "Service Locations",
                sidebarMeta: {
                    order: 7
                },
                data: {
                    mainmodule: "mealservicelocations",
                    childmodule: "view"
                }
            }).state("mealsvalue.mealservicelocations.list", {
                url: "/list",
                templateUrl: "app/pages/categories/mealservicelocations/view.html",
                title: "Service Locations",
                controller: "ListMealservicelocationsCtrl",
                sidebarMeta: {
                    order: 1
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicelocations", "view")
                }
            }).state("mealsvalue.mealservicelocations.add", {
                url: "/add",
                templateUrl: "app/pages/categories/mealservicelocations/add.html",
                title: "Service Location",
                controller: "AddMealservicelocationsCtrl",
                sidebarMeta: {
                    order: 2
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicelocations", "create")
                }
            }).state("mealsvalue.mealservicelocations.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/mealservicelocations/add.html",
                title: "Service Location",
                controller: "EditMealservicelocationsCtrl",
                sidebarMeta: {
                    order: 3
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicelocations", "update")
                }
            });
        $urlRouterProvider.when('/categories/mealservicelocations', '/categories/mealservicelocations/list');
    }
})();