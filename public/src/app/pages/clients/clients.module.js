/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.clients', ['ui.select', 'ngSanitize'])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state("clients", {
                url: "/clients",
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                controller: "ClientsCtrl",
                abstract: !1,
                title: "Clients",
                data: {
                    mainmodule: "clients",
                    childmodule: "view"
                },
                sidebarMeta: {
                    icon: "ion-person-stalker",
                    order: 2
                }
            }).state("clients.list", {
                url: "/list",
                templateUrl: "app/pages/clients/view.html",
                title: "Clients",
                controller: "ClientsCtrl",
                sidebarMeta: {
                    order: 1
                },
                resolve: {
                    havePermission: checkUserPermission("clients", "view")
                }
            }).state("clients.add", {
                url: "/add",
                templateUrl: "app/pages/clients/add.html",
                title: "Add Client",
                controller: "AddClientsCtrl",
                sidebarMeta: {
                    order: 2
                },
                resolve: {
                    havePermission: checkUserPermission("clients", "create")
                }
            }).state("clients.edit", {
                url: "/edit/:id",
                templateUrl: "app/pages/clients/add.html",
                title: "Client",
                controller: "EditClientsCtrl",
                resolve: {
                    havePermission: checkUserPermission("clients", "update")
                }
            }).state("clients.viewdetails", {
                url: "/view/:id",
                templateUrl: "app/pages/clients/viewdetails.html",
                title: "Client",
                controller: "ViewClientsCtrl",
                resolve: {
                    havePermission: checkUserPermission("clients", "view")
                }
            }).state("clients.edit-profile", {
                url: "/editprofile",
                templateUrl: "app/pages/clients/editprofile.html",
                title: "Profile",
                controller: "editProfileCtrl",
                data: {
                    mainmodule: "clients",
                    childmodule: "editprofile"
                },
                resolve: {
                    havePermission: checkUserPermission("clients", "editprofile")
                }
            });
        $urlRouterProvider.when('/clients', '/clients');
    }
})();