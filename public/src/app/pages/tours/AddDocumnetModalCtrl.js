/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddDocumentModalCtrl', AddDocumentModalCtrl);

    /** @ngInject */
    function AddDocumentModalCtrl($scope, $rootScope, $compile, $injector, UsersFactory, $uibModalInstance, Notification, ToursFactory, docLink, docTitle, docName) {
        $scope.btnName = "Add",
            $scope.titleName = "Add Document",
            $scope.isSubmitted = !1;
        var u = $rootScope.auth_user.name;
        $scope.formdocscope = {
                name: u
            },
            $scope.loginID = $rootScope.auth_user.id;
        if (docLink) {
            $scope.btnName = 'Update';
            $scope.titleName = 'Edit Document';
            $scope.formdocscope.title = docTitle;
            $scope.formdocscope.link = docLink;
            $scope.formdocscope.name = docName;
            $scope.formdocscope.created_by = $scope.loginID;
        }
        var m = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation;
        var p = {
                link: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            },
            g = {
                link: {
                    error: $scope.errorMessage.link.error,
                    success: ""
                }
            };
        m.setExpression(p).setDefaultMsg(g), $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $uibModalInstance.close($scope.formdocscope)
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();