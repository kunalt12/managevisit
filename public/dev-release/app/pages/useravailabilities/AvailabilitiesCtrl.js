/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.useravailabilities')
    .controller('AvailabilitiesCtrl', AvailabilitiesCtrl);

  /** @ngInject */
  function AvailabilitiesCtrl($scope, fileReader, $filter, DTOptionsBuilder, DTColumnBuilder, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.dtInstance = {};
        
        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        };

        $scope.createdRow = function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        $scope.statueRender = function(data, type, full) {
            if (data == 1) {
                return "Unavailable";
            } else {
                return "Available";
            }
        };

        $scope.indexNumber = function(data, type, full, row) {
            var i = Number(row.row) + Number(1);
            var ind = row.settings._iDisplayStart + i;
            return "<span>" + ind + "</span>";
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDataProp('data')
            .withOption('ajax', function (data, callback, settings) {
                  // map your server's response to the DataTables format and pass it to
                UsersFactory.showAvailabilitiesDataTable(data).success(function (res) { 
                    if (res.error)
                      $scope.reloadData();
                    else // DataTables' callback
                    callback(res);
                }).error(function (err) {
                    if (err.error)
                    $scope.reloadData();
                });
            })
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('simple_numbers')
            .withOption('order', [0, 'desc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('user.name').withTitle('User Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('status').withTitle('Status').withOption('searchable', true).renderWith($scope.statueRender),
            DTColumnBuilder.newColumn('comment').withTitle('Comment').withOption('searchable', true),
        ];
  }
})();
