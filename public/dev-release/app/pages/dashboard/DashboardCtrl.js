/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

    /** @ngInject */
    function DashboardCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $timeout, $stateParams, $state, $injector, Notification, DTOptionsBuilder, DTColumnBuilder, UsersFactory, DashboardsFactory, ToursFactory) {
        $scope.pageName = 'Dashboard';
        /** 
         * Get Dashboard data
         */
        DashboardsFactory.getRecord().success(function(response) {
            $scope.charts = response.data.countData;
            $scope.totalTour = response.data.totalTour;
            $scope.tourFilterData = response.data.tourCountData;
            if(Object.keys($rootScope.role)[0] == 1) {
                $scope.tourFilterData.Today_Total_Volunteer = response.data.today_total_volunteer;
            }
        }).error(function(error) {

        });
        /* End Dashboard Data */

        /**
         * Tour related data
         */
        $scope.dtInstance = {};
        $scope.isSubmitted = false;
        $scope.tours = {};

        $scope.reloadData = function() {
            $scope.dtInstance.rerender();
        };

        $scope.createdRow = function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        $scope.nameView = function(data, type, full) {
            return "<a ui-sref='tours.viewdetails({ id: " + full.id + " })'>" + full.name + "</a>";
        };

        $scope.actionTours = function(data, type, full) {
            return "<a title='View Tour' ui-sref='tours.viewdetails({ id: " + full.id + " })'><i class='fa fa-eye'></i></a> <a ng-if=\"havePermission('tours','update');\" ui-sref='tours.edit({ id: " + full.id + " })' title='Edit Tour'><i class='fa fa-edit'></i></a>";
        };

        $scope.setPerson = function(data, type, full) {
            return Number(data.adults) + Number(data.children) + Number(data.senior);
        };

        $scope.statusAction = function(data, type, full) {
            if (data.status == '0') {
                return '<small class="label label-warning">Pending</small>';
            }
            if (data.status == '1') {
                return '<small class="label label-info">Acknowledge</small>';
            }
            if (data.status == '2') {
                return '<small class="label label-success">Approved</small>';
            }
            if (data.status == '3') {
                return '<small class="label label-danger">Rejected</small>';
            } else {
                return '<small class="label label-primary">Completed</small>';
            }
        };

        $scope.mealOptions = function(data, type, full) {
            if(data.meals == "1") {
                return 'Yes';
            }
            else {
                return 'No';
            }
        };

        $scope.momentosOption = function(data, type, full) {
            if(full.tour_momentos.length > 0) {
                return 'Yes';
            }
            else {
                return 'No';
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
                DashboardsFactory.getTourDataTable(data).success(function(res) {
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
            .withOption('order', [0, 'desc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('name').withTitle('Tour Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('organization').withTitle('Organization Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('start_date').withTitle('Date Time Arriving').withOption('searchable', true),
            DTColumnBuilder.newColumn(null).withTitle('# of Visitors').withOption('searchable', false).notSortable().renderWith($scope.setPerson),
            DTColumnBuilder.newColumn('category').withTitle('Category').withOption('searchable', true),
            DTColumnBuilder.newColumn('tour_tapes.name').withTitle('Tour Type').withOption('searchable', true),
            DTColumnBuilder.newColumn('tour_manager.name').withTitle('Tour Manager').withOption('searchable', true),
            DTColumnBuilder.newColumn(null).withTitle('Meal').withOption('searchable', false).notSortable().renderWith($scope.mealOptions),
            DTColumnBuilder.newColumn(null).withTitle('Momento').withOption('searchable', true).renderWith($scope.momentosOption),
            // DTColumnBuilder.newColumn(null).withTitle('Status').withOption('searchable', false).notSortable().renderWith($scope.statusAction),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).notSortable().renderWith($scope.actionTours)
        ];
    }
})();