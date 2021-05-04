/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.emailtemplates', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("categories.emailtemplates", {
                url: "/emailtemplates",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                controller: "ListEmailTemplatesCtrl",
                title: "Email Templates",
                sidebarMeta: {
                    order: 7
                },
                data: {
                    mainmodule: "emailtemplates",
                    childmodule: "view"
                }
            }).state("categories.emailtemplates.list", {
                url: "/list",
                templateUrl: "app/pages/categories/emailtemplates/view.html",
                title: "Email Templates",
                controller: "ListEmailTemplatesCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("emailtemplates", "view")
                }
            }).state("categories.emailtemplates.add", {
                url: "/add",
                templateUrl: "app/pages/categories/emailtemplates/add.html",
                title: "Email Templates",
                controller: "AddEmailTemplatesCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("emailtemplates", "create")
                }
            }).state("categories.emailtemplates.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/categories/emailtemplates/add.html",
                title: "Email Templates",
                controller: "EditEmailTemplatesCtrl",
                sidebarMeta: {
                    order: 500
                },
                resolve: {
                    havePermission: checkUserPermission("emailtemplates", "update")
                }
            });
        $urlRouterProvider.when("/categories/emailtemplates", "/categories/emailtemplates/list");
    }
})();