/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.organizations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("categories.organizations", {
                url: "/organizations",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListOrganizationsCtrl",
                title: "Organization Types",
                sidebarMeta: {
                    order: 2
                },
                data: {
                    mainmodule: "organizations",
                    childmodule: "view"
                }
            }).state("categories.organizations.list", {
                url: "/list",
                templateUrl: "app/pages/categories/organizations/view.html",
                title: "Organization Types",
                controller: "ListOrganizationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("organizations", "view")
                }
            }).state("categories.organizations.add", {
                url: "/add",
                templateUrl: "app/pages/categories/organizations/add.html",
                title: "Organization Types",
                controller: "AddOrganizationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("organizations", "create")
                }
            }).state("categories.organizations.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/organizations/add.html",
                title: "Organization Types",
                controller: "EditOrganizationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("organizations", "update")
                }
            });
        $urlRouterProvider.when('/categories/organizations', '/categories/organizations/list');
    }
})();