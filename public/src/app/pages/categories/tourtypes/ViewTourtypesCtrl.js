/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.tourtypes')
        .controller('ViewTourtypesCtrl', ViewTourtypesCtrl);

    /** @ngInject */
    function ViewTourtypesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DefaulttasksFactory, TourtypesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "View";
        $scope.btnName = "Add Task";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.user = {
            status: null
        };
        $scope.statuses = [{
            value: 2,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        $scope.showStatus = function (t) {
            var o = [];
            return t.status && (o = $filter("filter")($scope.statuses, {
                value: t.status
            })), o.length ? o[0].text : "Not set"
        };
        TourtypesFactory.viewRecord($scope.urlID).success(function (t) {
            $scope.tourtype = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("categories.tourtypes.list")
        });
        $scope.addTask = function () {
            $scope.inserted = {
                id: null,
                task: "",
                status: null
            }, $scope.tourtype.defaulttask.push($scope.inserted)
        };
        $scope.cancelRow = function (t) {
            $scope.showTable = !1, $scope.tourtype.defaulttask.splice(t, 1), $scope.showTable = !0
        };
        $injector.get("$validation");
        $scope.errorMessage = DefaulttasksFactory.validation;
        $scope.checkTask = function (t) {
            return "" == t ? $scope.errorMessage.task.required : t.length <= 2 ? $scope.errorMessage.task.minlength : t.length >= 200 ? $scope.errorMessage.task.maxlength : void 0
        };
        $scope.removeTask = function (t, a) {
            DefaulttasksFactory.deleteRecord(t).success(function (t) {
                Notification.success(t.success), $scope.showTable = !1, $scope.tourtype.defaulttask.splice(a, 1), $scope.showTable = !0
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.checkStatus = function (t) {
            console.log("Checking status : ", t);
            if (null == t) return $scope.errorMessage.status.required
        };
        $scope.add_data = function (t, a, o) {
            t.tourtype_id = $scope.tourtype.id, o ? (t._method = "PUT", DefaulttasksFactory.updateRecord(o, t).success(function (o) {
                $scope.tourtype.defaulttask[a].status = t.status, Notification.success(o.success)
            }).error(function (e) {
                Notification.error(e.error)
            })) : DefaulttasksFactory.addRecord(t).success(function (o) {
                $scope.tourtype.defaulttask[a] = o.data, $scope.tourtype.defaulttask[a].status = t.status, Notification.success(o.success)
            }).error(function (e) {
                Notification.error(e.error)
            })
        }
    }
})();