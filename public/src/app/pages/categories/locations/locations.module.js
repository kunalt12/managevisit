/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.locations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("categories.locations", {
                url: "/locations",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListLocationsCtrl",
                title: "Info Session",
                sidebarMeta: {
                    order: 4
                },
                data: {
                    mainmodule: "locations",
                    childmodule: "view"
                }
            }).state("categories.locations.list", {
                url: "/list",
                templateUrl: "app/pages/categories/locations/view.html",
                title: "Info Session",
                controller: "ListLocationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("locations", "view")
                }
            }).state("categories.locations.add", {
                url: "/add",
                templateUrl: "app/pages/categories/locations/add.html",
                title: "Info Session",
                controller: "AddLocationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("locations", "create")
                }
            }).state("categories.locations.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/locations/add.html",
                title: "Info Session",
                controller: "EditLocationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("locations", "update")
                }
            });
        $urlRouterProvider.when('/categories/locations', '/categories/locations/list');
    }
})();