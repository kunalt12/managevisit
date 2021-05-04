/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.notifications')
        .controller('NotificationsCtrl', NotificationsCtrl);

    /** @ngInject */
    function NotificationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, NotificationsFactory, $timeout, ngDialog) {
        $scope.dtInstance = {};
        $rootScope.initialise();

        $scope.reloadData = function() {
            $scope.dtInstance.rerender();
        };

        $scope.createdRow = function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        $scope.indexNumber = function(data, type, full, row) {
            var i = Number(row.row) + Number(1);
            var ind = row.settings._iDisplayStart + i;
            return "<span>" + ind + "</span>";
        };

        $scope.changeDateFormat = function(data, type, full, row) {
            /*<span am-time-ago="msg.created_at | amUtc | amLocal"></span>
            return "<span am-time-ago='data.created_at | amUtc | amLocal'></span>";*/
            return "<span>{{"+data.created_at+" | amUtc | amLocal | amDateFormat:'dddd, MMMM Do YYYY, hh:mm:ss a'}}</span>";
            return "<span>{{data.created_at | amUtc | amLocal | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a'}}</span>";
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDataProp('data')
            .withOption('ajax', function(data, callback, settings) {
                // map your server's response to the DataTables format and pass it to
                NotificationsFactory.showDataTable(data).success(function(res) {
                    if (res.error)
                        $scope.reloadData();
                    else // DataTables' callback
                        callback(res);
                }).error(function(err) {
                    if (err.error)
                        $scope.reloadData();
                });
            })
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('simple_numbers')
            .withOption('order', [2, 'desc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('message').withTitle('Message').withOption('searchable', true),
            DTColumnBuilder.newColumn('created_at').withTitle('Date Time').withOption('searchable', true)
        ];
    }
})();