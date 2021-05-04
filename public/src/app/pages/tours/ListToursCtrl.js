/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('ListToursCtrl', ListToursCtrl);

    /** @ngInject */
    function ListToursCtrl($scope, $state, $stateParams, fileReader, $filter, $uibModal, $rootScope, $compile, ToursFactory, DTOptionsBuilder, DTColumnBuilder, $timeout, Notification) {
        $scope.dtInstance = {};
        $scope.isSubmitted = !1;
        $scope.tours = {};
        $scope.formData = {
            filterData: "0"
        };
        $scope.filterData = $scope.formData.filterData;
        if ($rootScope.auth_user) {
            $scope.loginUserID = $rootScope.auth_user.id;
        }
        $scope.urlID = $stateParams.id;
        if ($scope.urlID) {
            $scope.filterData = $scope.urlID;
            $scope.formData.filterData = $scope.urlID;
        }
        $scope.filerdatatable = function () {
            $scope.filterData = $scope.formData.filterData;
            $scope.reloadData()
        };
        $scope.searchData = [{
            label: "All",
            value: "0"
        }, {
            label: "Today",
            value: "1"
        }, {
            label: "Next 7 days",
            value: "2"
        }, {
            label: "This Month",
            value: "3"
        }, {
            label: "Confirmed",
            value: "4"
        }, {
            label: "Unconfirmed",
            value: "5"
        }, {
            label: "Completed",
            value: "6"
        }, {
            label: "Rejected",
            value: "7"
        }];
        $scope.reloadData = function () {
            $scope.dtInstance.rerender()
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.deleteRecord = function (e) {
            ToursFactory.deleteRecord(e).success(function (e) {
                Notification.success(e.success), $state.reload()
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.actionTours = function (t, a, o) {
            $scope.tours[o.id] = o;
            $scope.tours[o.id].isSubmitted = !1;
            var s = "",
                i = "",
                r = "";
            return "0" == t.status && (i = "<a class='cursor-pointer' ng-if=\"havePermission('tours','acknowledge');\" style='cursor:pointer' ng-click='acknowledge(" + o.id + ")' title='Acknowledge Tour'><i class='ion-android-checkbox-outline'></i></a> "), s = "<a class='cursor-pointer' ng-hide='tours[" + o.id + "].isSubmitted' ng-if=\"havePermission('tours','resend');\" style='cursor:pointer' ng-click='resendmailModal(" + o.id + ")' title='Resend Emails'><i class='ion-refresh'></i></a> ", (r = "<a class='cursor-pointer' ng-if=\"havePermission('tours','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this tour?' confirmed-click='deleteRecord(" + o.id + ")' title='Delete Tour'><i class='fa fa-trash'></i></a>"), i + s + "<a title='View Tour' ui-sref='tours.viewdetails({ id: " + o.id + " })'><i class='fa fa-eye'></i></a> <a ng-hide='" + o.status + " == 4' ng-if=\"havePermission('tours','update');\" ui-sref='tours.edit({ id: " + o.id + " })' title='Edit Tour'><i class='fa fa-edit'></i></a> " + r
        };
        $scope.resendmailModal = function (t) {
            var tour = $scope.tours[t];
            $uibModal.open({
                animation: !0,
                backdrop: "static",
                controller: "TourMailModalCtrl",
                templateUrl: "app/pages/tours/mailModal.html",
                resolve: {
                    tourStatus: function () {
                        return tour.status
                    }
                }
            }).result.then(function (a) {
                if (a) {
                    $scope.tours[t].isSubmitted = !0;
                    console.log("AFTER FORMSCOPE ----", a);
                    var a = {
                        id: t,
                        sendMail: a.sendMail,
                        mailSubject: a.mailSubject,
                        mailContent: a.mailContent,
                        action: a.status
                    };
                    ToursFactory.resend(a).success(function (a) {
                        Notification.success(a.success);
                        $scope.tours[t].isSubmitted = !1;
                    }).error(function (a) {
                        $scope.tours[t].isSubmitted = !1;
                        Notification.error(a.error);
                    })
                }
            })
        };
        $scope.acknowledge = function (t) {
            $uibModal.open({
                animation: !0,
                controller: "AddCommentModalCtrl",
                templateUrl: "app/pages/tours/commentModal.html"
            }).result.then(function (a) {
                $scope.sendackmailModal(t, a);
            })
        },
            $scope.sendackmailModal = function (t, a) {
                $uibModal.open({
                    animation: !0,
                    backdrop: "static",
                    controller: "TourMailModalCtrl",
                    templateUrl: "app/pages/tours/mailModal.html",
                    resolve: {
                        tourStatus: function () {
                            return 1
                        }
                    }
                }).result.then(function (o) {
                    if (o) {
                        var o = {
                            id: t,
                            action: o.status,
                            comment: a,
                            sendMail: o.sendMail,
                            mailSubject: o.mailSubject,
                            mailContent: o.mailContent
                        };
                        ToursFactory.actionRecord(o).success(function (a) {
                            Notification.success(a.success);
                            $scope.tours[t].isSubmitted = !1;
                            $scope.reloadData();
                        }).error(function (a) {
                            $scope.tours[t].isSubmitted = !1;
                            Notification.error(a.error);
                        })
                    }
                })
            };
        $scope.setPerson = function (e, t, a) {
            return Number(e.adults) + Number(e.children) + Number(e.senior);
        };
        $scope.mealOptions = function (e, t, a) {
            return "1" == e.meals ? "Yes" : "No";
        };
        $scope.momentosOption = function (e, t, a) {
            return a.tour_momentos.length > 0 ? "Yes" : "No";
        };
        $scope.statusAction = function (e, t, a) {
            return "0" == e.status ? '<small class="label label-warning">Pending</small>' : "1" == e.status ? '<small class="label label-info">Acknowledge</small>' : "2" == e.status ? '<small class="label label-success">Approved</small>' : "3" == e.status ? '<small class="label label-danger">Rejected</small>' : '<small class="label label-primary">Completed</small>';
        };
        $scope.indexNumber = function (e, t, a, o) {
            var s = Number(o.row) + Number(1);
            var i = o.settings._iDisplayStart + s;
            return "<span>" + i + "</span>";
        };
        $scope.viewTour = function (t, a, o) {
            return ' <a ui-sref="tours.viewdetails({ id: ' + o.id + ' });"> ' + t + '</a>';
        };
        $scope.nameView = function (e, t, a) {
            return "<a ui-sref='tours.viewdetails({ id: " + a.id + " })'>" + a.name + "</a>"
        };
        $scope.Creator = function (e, t, a) {
            return a.creator
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDataProp("data").withOption("ajax", function (t, a, o) {
            t.filerData = $scope.filterData, ToursFactory.showDataTable(t).success(function (t) {
                t.error ? $scope.reloadData() : a(t)
            }).error(function (t) {
                t && $scope.reloadData()
            })
        })
            .withOption("processing", !0)
            .withOption("serverSide", !0)
            .withPaginationType("simple_numbers")
            .withOption("order", [0, "desc"])
            .withDOM("lftip")
            .withOption("searchDelay", 500)
            .withOption("createdRow", $scope.createdRow);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn("id").withTitle("No").withOption("searchable", !1).renderWith($scope.indexNumber).withClass("table-index"),
            DTColumnBuilder.newColumn("name").withTitle("Tour Name").withOption("searchable", !0).renderWith($scope.nameView),
            DTColumnBuilder.newColumn("organization").withTitle("Organization Name").withOption("searchable", !0),
            DTColumnBuilder.newColumn("start_date").withTitle("Date Time Arriving").withOption("searchable", !0),
            DTColumnBuilder.newColumn(null).withTitle("# of Visitors").withOption("searchable", !1).notSortable().renderWith($scope.setPerson),
            DTColumnBuilder.newColumn("category").withTitle("Category").withOption("searchable", !0),
            DTColumnBuilder.newColumn("tapes.name").withTitle("Tour Type").withOption("searchable", !0),
            DTColumnBuilder.newColumn("tour_manager.name").withTitle("Tour Manager").withOption("searchable", !0),
            DTColumnBuilder.newColumn(null).withTitle("Meal").withOption("searchable", !1).notSortable().renderWith($scope.mealOptions),
            DTColumnBuilder.newColumn(null).withTitle("Momento").withOption("searchable", !0).renderWith($scope.momentosOption),
            DTColumnBuilder.newColumn(null).withTitle("Status").withOption("searchable", !1).notSortable().renderWith($scope.statusAction),
            DTColumnBuilder.newColumn("creator").withTitle("Created By").withOption("searchable", !0).renderWith($scope.Creator),
            DTColumnBuilder.newColumn(null).withTitle("Action").withOption("searchable", !1).notSortable().renderWith($scope.actionTours)
        ];
    }
})();
