/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('ListToursCtrl', ListToursCtrl);

    /** @ngInject */
    function ListToursCtrl($scope, $state, $stateParams, fileReader, $filter, $uibModal, $rootScope, $compile, ToursFactory, DTOptionsBuilder, DTColumnBuilder, $timeout, Notification) {
        $scope.dtInstance = {};
        $scope.isSubmitted = false;
        $scope.tours = {};
        $scope.formData = { filterData: '0' };
        $scope.filterData = $scope.formData.filterData;
        if($rootScope.auth_user) {
            $scope.loginUserID = $rootScope.auth_user.id;
        }
        
        $scope.urlID = $stateParams.id;        
        if($scope.urlID) {
            $scope.filterData = $scope.urlID;
            $scope.formData.filterData = $scope.urlID;
        }

        $scope.filerdatatable = function() {
            $scope.filterData = $scope.formData.filterData;
            $scope.reloadData();
        };

        $scope.searchData = [
            { label: 'All', value: '0' },
            { label: 'Today', value: '1' },
            { label: 'Next 7 days', value: '2' },
            { label: 'This Month', value: '3' },
            { label: 'Confirmed', value: '4' },
            { label: 'Unconfirmed', value: '5' }
        ];

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

        $scope.deleteRecord = function(id) {
            ToursFactory.deleteRecord(id).success(function (res) {
                Notification.success(res.success);
                $state.reload();
            }).error(function (err) {
                Notification.error(err.error);
            });
        }

        $scope.actionTours = function(data, type, full) {
            $scope.tours[full.id] = full;
            $scope.tours[full.id].isSubmitted = false;

            var reLink = '';
            var acknowledge = '';
            var deleteBtn = '';
            if (data.status == '0') {
                reLink = "<a class='cursor-pointer' ng-hide='tours[" + full.id + "].isSubmitted' ng-if=\"havePermission('tours','resend');\" style='cursor:pointer' ng-click='resendmailModal(" + full.id + ")' title='Resend link'><i class='ion-refresh'></i></a> ";
                acknowledge = "<a class='cursor-pointer' ng-if=\"havePermission('tours','acknowledge');\" style='cursor:pointer' ng-click='acknowledge(" + full.id + ")' title='Acknowledge Tour'><i class='ion-android-checkbox-outline'></i></a> ";
            }
            // console.log('-----',data.user_id);
            if ($scope.loginUserID == 1) {
                deleteBtn = "<a class='cursor-pointer' ng-if=\"havePermission('tours','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this tour?' confirmed-click='deleteRecord(" + full.id + ")' title='Delete Tour'><i class='fa fa-trash'></i></a>";
            }

            return acknowledge + reLink + "<a title='View Tour' ui-sref='tours.viewdetails({ id: " + full.id + " })'><i class='fa fa-eye'></i></a> <a ng-hide='"+full.status+" == 4' ng-if=\"havePermission('tours','update');\" ui-sref='tours.edit({ id: " + full.id + " })' title='Edit Tour'><i class='fa fa-edit'></i></a> "+deleteBtn;
        };
        
        $scope.resendmailModal = function(tourId){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                controller: 'TourMailModalCtrl',
                templateUrl: 'app/pages/tours/mailModal.html',
                resolve: {
                    tourStatus: function() {
                        return 0;
                    }
                }
            }).result.then(function(data) {
                if(data.sendMail == 1){
                    $scope.tours[tourId].isSubmitted = true;
                    var data = {
                        id: tourId,
                        sendMail: data.sendMail,
                        mailSubject: data.mailSubject,
                        mailContent: data.mailContent
                    };
                    ToursFactory.resend(data).success(function(res) {
                        Notification.success(res.success);
                        $scope.tours[tourId].isSubmitted = false;
                    }).error(function(err) {
                        $scope.tours[tourId].isSubmitted = false;
                        Notification.error(err.error);
                    });
                }
            });
        }

        $scope.acknowledge = function(id) {
            $uibModal.open({
                animation: true,
                controller: 'AddCommentModalCtrl',
                templateUrl: 'app/pages/tours/commentModal.html'
            }).result.then(function(commentforacknowledge) {
                $scope.sendackmailModal(id, commentforacknowledge);                
            });
        };
        
        
        $scope.sendackmailModal = function(tourId, commentforacknowledge){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                controller: 'TourMailModalCtrl',
                templateUrl: 'app/pages/tours/mailModal.html',
                resolve: {
                    tourStatus: function() {
                        return 1;
                    }
                }
            }).result.then(function(data) {
                if(data.sendMail == 1){
                    var data = {
                        id: tourId,
                        action: 1,
                        comment: commentforacknowledge,
                        sendMail: data.sendMail,
                        mailSubject: data.mailSubject,
                        mailContent: data.mailContent
                    };

                    ToursFactory.actionRecord(data).success(function(res) {
                        Notification.success(res.success);
                        $scope.tours[tourId].isSubmitted = false;
                        $scope.reloadData();
                    }).error(function(err) {
                        $scope.tours[tourId].isSubmitted = false;
                        Notification.error(err.error);
                    });
                }
            });
        }

        $scope.setPerson = function(data, type, full) {
            return Number(data.adults) + Number(data.children) + Number(data.senior);
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

        $scope.indexNumber = function(data, type, full, row) {
            var i = Number(row.row) + Number(1);
            var ind = row.settings._iDisplayStart + i;
            return "<span>" + ind + "</span>";
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDataProp('data')
            .withOption('ajax', function(data, callback, settings) {
                data.filerData = $scope.filterData;
                // map your server's response to the DataTables format and pass it to
                ToursFactory.showDataTable(data).success(function(res) {
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
            DTColumnBuilder.newColumn('tapes.name').withTitle('Tour Type').withOption('searchable', true),
            DTColumnBuilder.newColumn('tour_manager.name').withTitle('Tour Manager').withOption('searchable', true),
            DTColumnBuilder.newColumn(null).withTitle('Meal').withOption('searchable', false).notSortable().renderWith($scope.mealOptions),
            DTColumnBuilder.newColumn(null).withTitle('Momento').withOption('searchable', true).renderWith($scope.momentosOption),
            DTColumnBuilder.newColumn(null).withTitle('Status').withOption('searchable', false).notSortable().renderWith($scope.statusAction),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).notSortable().renderWith($scope.actionTours)
        ];
    }
})();