/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddNoteModalCtrl', AddNoteModalCtrl);

    /** @ngInject */
    function AddNoteModalCtrl($scope, $rootScope, $compile, $injector, UsersFactory, $uibModalInstance, Notification, ToursFactory, notesInfo, notesName) {
        $scope.btnName = "Add";
        $scope.titleName = "Add Note";
        $scope.isSubmitted = !1;
        $scope.loginID = $rootScope.auth_user.id;
        var d = $rootScope.auth_user.name;
        $scope.formnotescope = {
            name: d
        };
        if (notesInfo) {
            $scope.btnName = "Update";
            $scope.titleName = "Edit Note";
            $scope.formnotescope.note = notesInfo;
            $scope.formnotescope.name = notesName;
            $scope.formnotescope.created_by = $scope.loginID;
        }
        var u = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation;
        $scope.add_data = function (t) {
            u.validate(t).success(function () {
                $uibModalInstance.close($scope.formnotescope)
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();