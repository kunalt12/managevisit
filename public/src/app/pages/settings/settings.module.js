/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state("settings", {
                url: "/settings",
                templateUrl: "app/pages/settings/view.html",
                controller: "SettingsCtrl",
                title: "Settings",
                sidebarMeta: {
                    icon: "fa fa-cog",
                    order: 500
                },
                data: {
                    mainmodule: "global_settings",
                    childmodule: "view"
                },
                resolve: {
                    havePermission: checkUserPermission("global_settings", "view")
                }
            });
    }
})();