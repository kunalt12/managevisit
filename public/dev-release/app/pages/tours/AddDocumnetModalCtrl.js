/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddDocumentModalCtrl', AddDocumentModalCtrl);

    /** @ngInject */
    function AddDocumentModalCtrl($scope, $rootScope, $compile, $injector, UsersFactory, $uibModalInstance, Notification, ToursFactory, docLink, docTitle, docName) {
        $scope.btnName = 'Add';
        $scope.titleName = 'Add Document';
        $scope.isSubmitted = false;
        var userName = $rootScope.auth_user.name;
        $scope.formdocscope = { name: userName };

        $scope.loginID = $rootScope.auth_user.id;

        if(docLink) {
            $scope.btnName = 'Update';
            $scope.titleName = 'Edit Document';
            $scope.formdocscope.title = docTitle;
            $scope.formdocscope.link = docLink;
            $scope.formdocscope.name = docName;
            $scope.formdocscope.created_by = $scope.loginID;
        }

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = ToursFactory.validation;
        // var expression = {
        //     link: '^(http|https|ftp)?(://)?(www|ftp)?.?[a-z0-9-]+(.|:)([a-z0-9-]+)+([/?].*)?$'
        // };

        var expression = {
            link: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        };

        var validMsg = {
            link: {
                error: $scope.errorMessage.link.error,
                success: ''
            }
        };
        $validationProvider.setExpression(expression) // set expression
                          .setDefaultMsg(validMsg);
                          


        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $uibModalInstance.close($scope.formdocscope);
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
    }
})();