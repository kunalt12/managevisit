/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.transports')
    .controller('ListTransportsCtrl', ListTransportsCtrl);

  /** @ngInject */
  function ListTransportsCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, TransportsFactory, $timeout, Notification) {
      $scope.dtInstance = {};

      $scope.reloadData = function() {
          $scope.dtInstance.rerender();
      };

      $scope.createdRow = function(row, data, dataIndex) {
           // Recompiling so we can bind Angular directive to the DT
           $compile(angular.element(row).contents())($scope);
      };

      $scope.deleteRecord = function(id) {
        TransportsFactory.deleteRecord(id).success(function (res) {
            Notification.success(res.success);
            $state.reload();
        }).error(function (err) {
            Notification.error(err.error);
        });
      }

      $scope.actionRoles = function(data, type, full) {
          return "<a ng-if=\"havePermission('transports','update');\" ui-sref='categories.transports.edit({ id: " + full.id + " })'><i class='fa fa-edit'></i></a> <a ng-if=\"havePermission('transports','delete');\" ng-confirm-click='Are you sure to delete this transports type?' confirmed-click='deleteRecord( " + full.id + " )'><i class='fa fa-trash'></i></a>";
      };

      $scope.statusAction = function(data, type, full) {
            if(data.status == '0') {
                return '<small class="label label-danger">Inactive</small>';
            }
            else {
                return '<small class="label label-success">Active</small>';
            }
        };

      $scope.indexNumber = function(data, type, full, row) {
            var i = Number(row.row) + Number(1);
            var ind = row.settings._iDisplayStart + i;
            return "<span>" + ind + "</span>";
        };
      
      $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDataProp('data')
            .withOption('ajax', function(data, callback, settings) {
                // map your server's response to the DataTables format and pass it to
                TransportsFactory.showDataTable(data).success(function(res) {
                    if (res.error)
                        $scope.reloadData();
                    else
                        callback(res);
                }).error(function(err) {
                    if (err)
                        $scope.reloadData();
                });
            })
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('simple_numbers')
            .withOption('order', [1, 'asc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('name').withTitle('Name').withOption('searchable', true),
            // DTColumnBuilder.newColumn('description').withTitle('Description').withOption('searchable', false).notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Status').withOption('searchable', false).notSortable().renderWith($scope.statusAction),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).notSortable().renderWith($scope.actionRoles)
        ];
  }
})();