/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.roles')
        .controller('RolesCtrl', RolesCtrl);

    /** @ngInject */
    function RolesCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, RolesFactory, $timeout, ngDialog, Notification) {
        $scope.dtInstance = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.showPermissions = function (e, t, a) {
            return "<a href='javascript:void(0);' ng-click='getPermissions(" + a.id + ")'>Show Permissions</a>"
        };
        $scope.getPermissions = function (t) {
            ngDialog.open({
                template: "app/pages/roles/modal/showPermissions.html",
                scope: $scope,
                controller: ["$scope", "RolesFactory", "id", function (e, t, a) {
                    $scope.role = {}, t.getRolePermisssions(a).success(function (t) {
                        $scope.role.permissions = t
                    }).error(function (e) {})
                }],
                resolve: {
                    id: function () {
                        return t
                    }
                }
            })
        };
        $scope.deleteRecord = function (e) {
            RolesFactory.deleteRecord(e).success(function (e) {
                Notification.success(e.success), $state.reload()
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.actionRoles = function (e, t, a) {
            return 0 != a.is_editable ? "<a ui-sref='roles.edit({ id: " + a.id + " })'><i class='fa fa-edit'></i></a> <a class='cursor-pointer' ng-if=\"havePermission('roles','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this role?' confirmed-click='deleteRecord(" + a.id + ")' title='Delete role'><i class='fa fa-trash'></i></a>" : "-"
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
                RolesFactory.showDataTable(t).success(function (t) {
                    t.error ? $scope.reloadData() : a(t)
                }).error(function (t) {
                    t.error && $scope.reloadData()
                })
            }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [0, "asc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow),
            $scope.dtColumns = [
                DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
                DTColumnBuilder.newColumn("name").withTitle("Role Name"),
                DTColumnBuilder.newColumn("description").withTitle("Description"),
                DTColumnBuilder.newColumn("created_at").withTitle("Role Created On").withOption("searchable", !0),
                DTColumnBuilder.newColumn("count").withTitle("Total Permissions").withOption("searchable", !1).renderWith($scope.showPermissions).notSortable(),
                DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).renderWith($scope.actionRoles).notSortable()
            ]
    }
})();