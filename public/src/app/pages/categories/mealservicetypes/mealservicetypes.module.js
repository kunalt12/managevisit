/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealservicetypes', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("mealsvalue.mealservicetypes", {
                url: "/mealservicetypes",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListMealservicetypesCtrl",
                title: "Service Types",
                sidebarMeta: {
                    order: 8
                },
                data: {
                    mainmodule: "mealservicetypes",
                    childmodule: "view"
                }
            }).state("mealsvalue.mealservicetypes.list", {
                url: "/list",
                templateUrl: "app/pages/categories/mealservicetypes/view.html",
                title: "Service Types",
                controller: "ListMealservicetypesCtrl",
                sidebarMeta: {
                    order: 1
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicetypes", "view")
                }
            }).state("mealsvalue.mealservicetypes.add", {
                url: "/add",
                templateUrl: "app/pages/categories/mealservicetypes/add.html",
                title: "Service Type",
                controller: "AddMealservicetypesCtrl",
                sidebarMeta: {
                    order: 2
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicetypes", "create")
                }
            }).state("mealsvalue.mealservicetypes.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/mealservicetypes/add.html",
                title: "Service Type",
                controller: "EditMealservicetypesCtrl",
                sidebarMeta: {
                    order: 3
                },
                resolve: {
                    havePermission: checkUserPermission("mealservicetypes", "update")
                }
            });
        $urlRouterProvider.when('/categories/mealservicetypes', '/categories/mealservicetypes/list');
    }
})();