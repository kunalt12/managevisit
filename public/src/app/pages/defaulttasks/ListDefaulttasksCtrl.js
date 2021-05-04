/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.defaulttasks')
        .controller('ListDefaulttasksCtrl', ListDefaulttasksCtrl);

    /** @ngInject */
    function ListDefaulttasksCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, TourtypesFactory, DefaulttasksFactory, $timeout) {
        TourtypesFactory.getAllRecords().success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("defaulttasks.list")
        })
    }
})();