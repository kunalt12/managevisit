/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealservicetypes')
        .controller('EditMealservicetypesCtrl', EditMealservicetypesCtrl);

    /** @ngInject */
    function EditMealservicetypesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, MealservicetypesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Edit Meal Service Type";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.statusData = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.errorMessage = MealservicetypesFactory.validation, MealservicetypesFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("mealsvalue.mealservicetypes.list")
        }), $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, $scope.formscope._method = "PUT", MealservicetypesFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
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