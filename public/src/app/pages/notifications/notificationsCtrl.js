/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.notifications')
        .controller('NotificationsCtrl', NotificationsCtrl);

    /** @ngInject */
    function NotificationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, NotificationsFactory, $timeout, ngDialog) {
        $scope.dtInstance = {};
        $rootScope.initialise();
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.changeDateFormat = function (e, t, a, o) {
            return "<span>{{" + e.created_at + " | amUtc | amLocal | amDateFormat:'dddd, MMMM Do YYYY, hh:mm:ss a'}}</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
                NotificationsFactory.showDataTable(t).success(function (t) {
                    t.error ? $scope.reloadData() : a(t)
                }).error(function (t) {
                    t.error && $scope.reloadData()
                })
            }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [2, "desc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow),
            $scope.dtColumns = [
                DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
                DTColumnBuilder.newColumn("message").withTitle("Message").withOption("searchable", !0),
                DTColumnBuilder.newColumn("created_at").withTitle("Date Time").withOption("searchable", !0)
            ];
    }
})();