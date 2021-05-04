/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.affiliations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("categories.affiliations", {
                url: "/affiliations",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListAffiliationsCtrl",
                title: "Affiliations",
                sidebarMeta: {
                    order: 8
                },
                data: {
                    mainmodule: "affiliations",
                    childmodule: "view"
                }
            }).state("categories.affiliations.list", {
                url: "/list",
                templateUrl: "app/pages/categories/affiliations/view.html",
                title: "Affiliations",
                controller: "ListAffiliationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("affiliations", "view")
                }
            }).state("categories.affiliations.add", {
                url: "/add",
                templateUrl: "app/pages/categories/affiliations/add.html",
                title: "Affiliations",
                controller: "AddAffiliationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("affiliations", "create")
                }
            }).state("categories.affiliations.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/affiliations/add.html",
                title: "Affiliations",
                controller: "EditAffiliationsCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("affiliations", "update")
                }
            });
        $urlRouterProvider.when("/categories/affiliations", "/categories/affiliations/list");
    }
})();