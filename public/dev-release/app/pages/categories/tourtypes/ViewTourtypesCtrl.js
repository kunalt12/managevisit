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
        $scope.pageName = 'View';
        $scope.btnName = 'Add Task';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;
        $scope.user = {status:null};

        $scope.statuses = [
            { 'value': 2, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        $scope.showStatus = function(user) {
            var selected = [];
            if(user.status) {
                selected = $filter('filter')($scope.statuses, { value: user.status });
            }
            return selected.length ? selected[0].text : 'Not set';
        };
        
        TourtypesFactory.viewRecord($scope.urlID).success(function(response) {
            $scope.tourtype = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('categories.tourtypes.list');
        });

        // add user
        $scope.addTask = function() {
            $scope.inserted = {
                id: null,
                task: '',
                status: null
            };
            $scope.tourtype.defaulttask.push($scope.inserted);
        };

        $scope.cancelRow = function(index) {
            $scope.showTable = false;
            $scope.tourtype.defaulttask.splice(index, 1);
            $scope.showTable = true;
        };
        
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = DefaulttasksFactory.validation;

        $scope.checkTask = function($data) {
            if($data == '') {
                return $scope.errorMessage.task.required;
            }
            else if($data.length <= 2) {
                return $scope.errorMessage.task.minlength;
            }
            else if($data.length >= 200) {
                return $scope.errorMessage.task.maxlength;
            }
        };

        $scope.removeTask = function(id, index) {
            DefaulttasksFactory.deleteRecord(id).success(function (res) {
                Notification.success(res.success);
                $scope.showTable = false;
                $scope.tourtype.defaulttask.splice(index, 1);
                $scope.showTable = true;
            }).error(function (err) {
                Notification.error(err.error);
            });
        }

        $scope.checkStatus = function($data) {
            if($data == null) {
                return $scope.errorMessage.status.required;
            }
        };

        $scope.add_data = function(data, index, id) {
            data.tourtype_id = $scope.tourtype.id;
            
            if(id) {
                data._method = 'PUT';
                DefaulttasksFactory.updateRecord(id, data).success(function(res) {
                    $scope.tourtype.defaulttask[index].status = data.status;
                    Notification.success(res.success);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            }
            else {
                DefaulttasksFactory.addRecord(data).success(function(res) {
                    $scope.tourtype.defaulttask[index] = res.data;
                    $scope.tourtype.defaulttask[index].status = data.status;
                    Notification.success(res.success);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            }
        };
  }
})();
