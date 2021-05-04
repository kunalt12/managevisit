/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealcategories', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("mealsvalue.mealcategories", {
                url: "/mealcategories",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListMealcategoriesCtrl",
                title: "Categories",
                sidebarMeta: {
                    order: 9
                },
                data: {
                    mainmodule: "mealcategories",
                    childmodule: "view"
                }
            }).state("mealsvalue.mealcategories.list", {
                url: "/list",
                templateUrl: "app/pages/categories/mealcategories/view.html",
                title: "Categories",
                controller: "ListMealcategoriesCtrl",
                sidebarMeta: {
                    order: 1
                },
                resolve: {
                    havePermission: checkUserPermission("mealcategories", "view")
                }
            }).state("mealsvalue.mealcategories.add", {
                url: "/add",
                templateUrl: "app/pages/categories/mealcategories/add.html",
                title: "Category",
                controller: "AddMealcategoriesCtrl",
                sidebarMeta: {
                    order: 2
                },
                resolve: {
                    havePermission: checkUserPermission("mealcategories", "create")
                }
            }).state("mealsvalue.mealcategories.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/mealcategories/add.html",
                title: "Category",
                controller: "EditMealcategoriesCtrl",
                sidebarMeta: {
                    order: 3
                },
                resolve: {
                    havePermission: checkUserPermission("mealcategories", "update")
                }
            });
        $urlRouterProvider.when('/categories/mealcategories', '/categories/mealcategories/list');
    }
})();