/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.roles', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("roles", {
                url: "/roles",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                controller: "RolesCtrl",
                title: "Roles",
                abstract: !1,
                sidebarMeta: {
                    icon: "fa fa-user-secret",
                    order: 1
                },
                data: {
                    mainmodule: "roles",
                    childmodule: "view"
                },
                resolve: {
                    havePermission: checkUserPermission("roles", "view")
                }
            }).state("roles.list", {
                url: "/list",
                templateUrl: "app/pages/roles/view.html",
                title: "Roles",
                controller: "RolesCtrl",
                sidebarMeta: {
                    order: 1
                },
                resolve: {
                    havePermission: checkUserPermission("roles", "view")
                }
            }).state("roles.add", {
                url: "/add",
                templateUrl: "app/pages/roles/add.html",
                title: "Add Role",
                controller: "AddRolesCtrl",
                sidebarMeta: {
                    order: 2
                },
                resolve: {
                    havePermission: checkUserPermission("roles", "create")
                }
            }).state("roles.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/roles/add.html",
                title: "Roles",
                controller: "EditRolesCtrl",
                resolve: {
                    havePermission: checkUserPermission("roles", "update")
                }
            });
        $urlRouterProvider.when('/roles', '/roles/add/id');
    }
})();