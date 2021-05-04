/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.contactmanagements')
        .controller('ListContactmanagementsCtrl', ListContactmanagementsCtrl);

    /** @ngInject */
    function ListContactmanagementsCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, Contactmanagement, $timeout, Notification) {
        $scope.dtInstance = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.deleteRecord = function (e) {
            Contactmanagement.deleteRecord(e).success(function (e) {
                Notification.success(e.success), $state.reload()
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.actionRoles = function (e, t, a) {
            return "<a ui-sref='contactmanagements.viewdetails({ id: " + a.id + " })'><i class='fa fa-eye'></i></a> <a ui-sref='contactmanagements.edit({ id: " + a.id + " })'><i class='fa fa-edit'></i></a> <a class='cursor-pointer' ng-if=\"havePermission('tours','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this contact?' confirmed-click='deleteRecord(" + a.id + ")' title='Delete contact'><i class='fa fa-trash'></i></a>"
        };
        $scope.genderRender = function (e, t, a) {
            return "f" == e ? "Female" : "m" == e ? "Male" : "-"
        };
        $scope.statusAction = function (e, t, a) {
            return "2" == e.status ? '<small class="label label-danger">Inactive</small>' : '<small class="label label-success">Active</small>'
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
                Contactmanagement.showDataTable(t).success(function (t) {
                    t.error ? $scope.reloadData() : a(t)
                }).error(function (t) {
                    t && $scope.reloadData()
                })
            }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [1, "asc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow),
            $scope.dtColumns = [
                DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
                DTColumnBuilder.newColumn("name").withTitle("Name").withOption("searchable", !0),
                DTColumnBuilder.newColumn("email").withTitle("Email").withOption("searchable", !0),
                DTColumnBuilder.newColumn("mobile").withTitle("Mobile").withOption("searchable", !0),
                DTColumnBuilder.newColumn("visitordata.name").withTitle("Visitor Type").withOption("searchable", !0),
                DTColumnBuilder.newColumn("organization").withTitle("Organization").withOption("searchable", !0),
                DTColumnBuilder.newColumn("gender").withTitle("Gender").withOption("searchable", !0),
                DTColumnBuilder.newColumn(null).withTitle("Status").withOption("searchable", !1).notSortable().renderWith($scope.statusAction),
                DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).notSortable().renderWith($scope.actionRoles)
            ]
    }
})();