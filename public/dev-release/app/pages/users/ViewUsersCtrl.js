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
        
        $scope.pageName = 'Users - View';
        $scope.btnName = "View";
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.genderOption = [
            {label: '-', value:null},
            {label: 'Male', value: 'm'},
            {label: 'Female', value: 'f'}
        ];

        $scope.showGender = function(user) {
            var selected = [];
                selected = $filter('filter')($scope.genderOption, { value: user });
            return selected.length ? selected[0].label : '-';
        };
        
        UsersFactory.getRecord($scope.urlID).success(function (response) {
            $scope.formscope = response.data;
            $scope.formscope.gender_text = $scope.showGender($scope.formscope);
            
            if($scope.formscope.image && $scope.formscope.image != null) {
              $scope.imageUrl = config.profile_url+'/'+$scope.formscope.id+'/'+$scope.formscope.image;
            }
            else {
              $scope.imageUrl = config.profile_url+'/noImage.png';
            }
        }).error(function (error) {
                Notification.error(error.error);
                $state.go('roles.list');
        });
  }
})();