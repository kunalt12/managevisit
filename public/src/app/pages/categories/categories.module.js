/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories', [
        'BlurAdmin.pages.categories.meals',
        'BlurAdmin.pages.categories.transports',
        'BlurAdmin.pages.categories.visitors',
        'BlurAdmin.pages.categories.organizations',
        'BlurAdmin.pages.categories.tourtypes',
        'BlurAdmin.pages.categories.locations',
        'BlurAdmin.pages.categories.mealservicetypes',
        'BlurAdmin.pages.categories.mealservicelocations',
        // 'BlurAdmin.pages.categories.mealcategories',
        'BlurAdmin.pages.categories.momentos',
        "BlurAdmin.pages.categories.emailtemplates",
        "BlurAdmin.pages.categories.affiliations",
    ]).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state("categories", {
                url: "/categories",
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                title: "Manage Values",
                sidebarMeta: {
                    icon: "ion-android-laptop",
                    order: 100
                },
                data: {
                    mainmodule: "categories",
                    childmodule: "view"
                }
            }).state("mealsvalue", {
                url: "/categories",
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: !0,
                title: "Manage Meals",
                sidebarMeta: {
                    icon: "ion-android-laptop",
                    order: 99
                },
                data: {
                    mainmodule: "categories",
                    childmodule: "view"
                }
            });
    }
})();