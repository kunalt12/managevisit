/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

    /** @ngInject */
    function DashboardCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $timeout, $stateParams, $state, $injector, Notification, DTOptionsBuilder, DTColumnBuilder, UsersFactory, DashboardsFactory, ToursFactory) {
        $scope.pageName = "Dashboard";
        DashboardsFactory.getRecord().success(function (t) {
            $scope.charts = t.data.countData, $scope.totalTour = t.data.totalTour, $scope.tourFilterData = t.data.tourCountData, 1 == Object.keys($rootScope.role)[0] && ($scope.tourFilterData.Today_Total_Volunteer = t.data.today_total_volunteer)
        }).error(function (e) {});
        $scope.dtInstance = {};
        $scope.isSubmitted = !1;
        $scope.tours = {};
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.nameView = function (e, t, a) {
            return "<a ui-sref='tours.viewdetails({ id: " + a.id + " })'>" + a.name + "</a>"
        };
        $scope.actionTours = function (e, t, a) {
            return "<a title='View Tour' ui-sref='tours.viewdetails({ id: " + a.id + " })'><i class='fa fa-eye'></i></a> <a ng-if=\"havePermission('tours','update');\" ui-sref='tours.edit({ id: " + a.id + " })' title='Edit Tour'><i class='fa fa-edit'></i></a>"
        };
        $scope.setPerson = function (e, t, a) {
            return Number(e.adults) + Number(e.children) + Number(e.senior)
        };
        $scope.statusAction = function (e, t, a) {
            return "0" == e.status ? '<small class="label label-warning">Pending</small>' : "1" == e.status ? '<small class="label label-info">Acknowledge</small>' : "2" == e.status ? '<small class="label label-success">Approved</small>' : "3" == e.status ? '<small class="label label-danger">Rejected</small>' : '<small class="label label-primary">Completed</small>'
        };
        $scope.mealOptions = function (e, t, a) {
            return "1" == e.meals ? "Yes" : "No"
        };
        $scope.momentosOption = function (e, t, a) {
            return a.tour_momentos.length > 0 ? "Yes" : "No"
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1),
                i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>"
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
                DashboardsFactory.getTourDataTable(t).success(function (t) {
                    t.error ? $scope.reloadData() : a(t)
                }).error(function (t) {
                    t && $scope.reloadData()
                })
            }).withOption("processing", !0).withOption("serverSide", !0).withPaginationType("simple_numbers").withOption("order", [0, "desc"]).withDOM("lftip").withOption("searchDelay", 500).withOption("createdRow", $scope.createdRow),
            $scope.dtColumns = [
                DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
                DTColumnBuilder.newColumn("name").withTitle("Tour Name").withOption("searchable", !0),
                DTColumnBuilder.newColumn("organization").withTitle("Organization Name").withOption("searchable", !0),
                DTColumnBuilder.newColumn("start_date").withTitle("Date Time Arriving").withOption("searchable", !0),
                DTColumnBuilder.newColumn(null).withTitle("# of Visitors").withOption("searchable", !1).notSortable().renderWith($scope.setPerson),
                DTColumnBuilder.newColumn("category").withTitle("Category").withOption("searchable", !0),
                DTColumnBuilder.newColumn("tour_tapes.name").withTitle("Tour Type").withOption("searchable", !0),
                DTColumnBuilder.newColumn("tour_manager.name").withTitle("Tour Manager").withOption("searchable", !0),
                DTColumnBuilder.newColumn(null).withTitle("Meal").withOption("searchable", !1).notSortable().renderWith($scope.mealOptions),
                DTColumnBuilder.newColumn(null).withTitle("Momento").withOption("searchable", !0).renderWith($scope.momentosOption),
                DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).notSortable().renderWith($scope.actionTours)
            ]
    }
})();