/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tours')
    .controller('AddTaskModalCtrl', AddTaskModalCtrl);

  /** @ngInject */
  function AddTaskModalCtrl($scope, $uibModalInstance) {
    $scope.task = '';
    $scope.message = '';
    $scope.ok = function () {
      if($scope.task) {
        $uibModalInstance.close($scope.task);
      }
      else {
        $scope.message = 'Please add task';
      }
    };
  }
})();