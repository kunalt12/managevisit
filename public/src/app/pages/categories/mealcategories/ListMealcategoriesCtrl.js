/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.mealcategories')
        .controller('ListMealcategoriesCtrl', ListMealcategoriesCtrl);

    /** @ngInject */
    function ListMealcategoriesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, MealcategoriesFactory, $timeout, Notification) {
        $scope.dtInstance = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            i(angular.element(t).contents())($scope)
        };
        $scope.actionRoles = function (e, t, a) {
            return "<a ui-sref='mealsvalue.mealcategories.edit({ id: " + a.id + " })'><i class='fa fa-edit'></i></a>"
        };
        $scope.statusAction = function (e, t, a) {
            return "0" == $scope.status ? '<small class="label label-danger">Inactive</small>' : '<small class="label label-success">Active</small>'
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
                MealcategoriesFactory.showDataTable(t).success(function (t) {
                    t.error ? $scope.reloadData() : a(t)
                }).error(function (t) {
                    t && $scope.reloadData()
                })
            }).withOption("processing", !0)
            .withOption("serverSide", !0)
            .withPaginationType("simple_numbers")
            .withOption("order", [1, "asc"])
            .withDOM("lftip")
            .withOption("searchDelay", 500)
            .withOption("createdRow", $scope.createdRow),
            $scope.dtColumns = [
                DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
                DTColumnBuilder.newColumn("name").withTitle("Name").withOption("searchable", !0),
                DTColumnBuilder.newColumn(null).withTitle("Status").withOption("searchable", !1).notSortable().renderWith($scope.statusAction),
                DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).notSortable().renderWith($scope.actionRoles)
            ]
    }
})();