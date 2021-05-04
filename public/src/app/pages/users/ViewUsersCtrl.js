/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('ViewUsersCtrl', ViewUsersCtrl);

    /** @ngInject */
    function ViewUsersCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $stateParams, UsersFactory, $timeout, ngDialog, $config) {
        $scope.pageName = "Users - View";
        $scope.btnName = "View";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.genderOption = [{
            label: "-",
            value: null
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }];
        $scope.showGender = function (t) {
            var o = [];
            return o = $filter("filter")($scope.genderOption, {
                value: t
            }), o.length ? o[0].label : "-"
        };
        UsersFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
            $scope.formscope.gender_text = $scope.showGender($scope.formscope);
            if ($scope.formscope.image && null != $scope.formscope.image) {
                $scope.imageUrl = config.profile_url + "/" + $scope.formscope.id + "/" + $scope.formscope.image;
            } else {
                $scope.imageUrl = config.profile_url + "/noImage.png";
            }
        }).error(function (e) {
            Notification.error(e.error);
            $state.go("roles.list");
        })
    }
})();