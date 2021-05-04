/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealservicetypes')
        .controller('AddMealservicetypesCtrl', AddMealservicetypesCtrl);

    /** @ngInject */
    function AddMealservicetypesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, MealservicetypesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.formscope = {
            status: 1,
            type: 1
        };
        $scope.pageName = "Add Meal Service Type";
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.statusData = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.errorMessage = MealservicetypesFactory.validation, $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, MealservicetypesFactory.addRecord($scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("mealsvalue.mealservicetypes.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();