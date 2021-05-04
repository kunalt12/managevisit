/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.useravailabilities')
        .controller('AvailabilitiesCtrl', AvailabilitiesCtrl);

    /** @ngInject */
    function AvailabilitiesCtrl($scope, fileReader, $filter, DTOptionsBuilder, DTColumnBuilder, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.dtInstance = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.statueRender = function (e, t, a) {
            return 1 == e ? "Unavailable" : "Available"
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
            UsersFactory.showAvailabilitiesDataTable(t).success(function (t) {
                if (t.error) {
                    $scope.reloadData();
                } else {
                    a(t);
                }
            }).error(function (t) {
                if (t.error) {
                    $scope.reloadData();
                }
            })
        }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [0, "desc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
            DTColumnBuilder.newColumn("user.name").withTitle("User Name").withOption("searchable", !0),
            DTColumnBuilder.newColumn("status").withTitle("Status").withOption("searchable", !0).renderWith($scope.statueRender),
            DTColumnBuilder.newColumn("comment").withTitle("Comment").withOption("searchable", !0)
        ]
    }
})();