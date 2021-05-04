/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.clients')
        .controller('ClientsCtrl', ClientsCtrl);

    /** @ngInject */
    function ClientsCtrl($scope, fileReader, $state, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, CLientsFactory, $timeout, ngDialog, Notification) {
        $scope.dtInstance = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope);
        };
        $scope.genderRender = function (e, t, a) {
            return "f" == e ? "Female" : "m" == e ? "Male" : "-";
        };
        $scope.changePassword = function (e) {
            $uibModal.open({
                animation: !0,
                size: "sm",
                controller: "ChangePasswordCtrl",
                templateUrl: "app/pages/clients/changePassword.html",
                resolve: {
                    client_id: function () {
                        return e
                    }
                }
            }).result.then(function (e) {})
        };
        $scope.resendmailModal = function (t) {
            $uibModal.open({
                animation: !0,
                backdrop: "static",
                controller: "ClientMailModalCtrl",
                templateUrl: "app/pages/clients/mailModal.html",
                resolve: {}
            }).result.then(function (a) {
                a.clientId = t;
                if (1 == a.sendMail) {
                    $scope.resendEmail(a);
                }
            })
        };
        $scope.resendEmail = function (t) {
            $scope.clients[t.clientId].isSubmitted = !0;
            var a = {
                id: t.clientId,
                sendMail: t.sendMail,
                mailSubject: t.mailSubject,
                mailContent: t.mailContent
            };
            ClientsFactory.resendEmail(a).success(function (a) {
                Notification.success(a.success);
                $scope.clients[t.clientId].isSubmitted = !1;
            }).error(function (a) {
                $scope.clients[t.clientId].isSubmitted = !1;
                Notification.error(a.error);
            })
        };
        $scope.roleRender = function (e, t, a) {
            if (e) {
                var o = $scope.role.split("||");
                return o[1];
            }
            return "-";
        };
        $scope.deleteRecord = function (e) {
            ClientsFactory.deleteRecord(e).success(function (e) {
                Notification.success(e.success);
                $state.reload();
            }).error(function (e) {
                Notification.error(e.error);
            })
        };
        $scope.actionRoles = function (t, a, o) {
            if (0 != o.is_editable) {
                var s = "";
                if (o.mobile) {
                    $scope.clients[o.id] = o;
                    $scope.clients[o.id].isSubmitted = !1;
                    s = "<a ng-if=\"havePermission('clients','resend.email');\" class='cursor-pointer' ng-hide='clients[" + o.id + "].isSubmitted' style='cursor:pointer' ng-click='resendmailModal(" + o.id + ")' title='Resend Email'><i class='fa fa-repeat'></i></a> ";
                }
                return "<a ng-if=\"havePermission('clients','view');\" ui-sref='clients.viewdetails({ id: " + o.id + " })'><i class='fa fa-eye'></i></a> <a ng-if=\"havePermission('clients','update');\" ui-sref='clients.edit({ id: " + o.id + " })'><i class='fa fa-edit'></i></a> <a ng-click='changePassword(" + o.id + ")' ng-if=\"havePermission('clients','update.password');\" title='Change Password'><i class='fa fa-key'></i></a> <a ng-if=\"havePermission('clients','delete');\" class='cursor-pointer' style='cursor:pointer' ng-confirm-click='Are you sure to delete this client?' confirmed-click='deleteRecord(" + o.id + ")' title='Delete Client'><i class='fa fa-trash'></i></a> " + s;
            }
            return "-";
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
            ClientsFactory.showDataTable(t).success(function (clientD) {
                if (clientD.error) {
                    $scope.reloadData();
                } else {
                    a(clientD);
                }
            }).error(function (err) {
                if (err.error) {
                    $scope.reloadData();
                }
            })
        }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [1, "asc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
            DTColumnBuilder.newColumn("name").withTitle("Name").withOption("searchable", !0),
            DTColumnBuilder.newColumn("email").withTitle("Email").withOption("searchable", !0),
            DTColumnBuilder.newColumn("mobile").withTitle("Mobile").withOption("searchable", !0),
            DTColumnBuilder.newColumn("gender").withTitle("Gender").withOption("searchable", !0),
            DTColumnBuilder.newColumn("role").withTitle("Role").withOption("searchable", !0),
            DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).renderWith($scope.actionRoles).notSortable()
        ]
    }
})();