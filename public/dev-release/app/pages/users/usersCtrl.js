/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
    .controller('UsersCtrl', UsersCtrl);

  /** @ngInject */
  function UsersCtrl($scope, fileReader, $state, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, UsersFactory, $timeout, ngDialog, Notification) {
        $scope.dtInstance = {};
        
        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        };

        $scope.createdRow = function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        $scope.genderRender = function(data, type, full) {
            if (data == 'f') {
                return "Female";
            } else if (data == 'm') {
                return "Male";
            } else {
                return "-";
            }
        };

        $scope.changePassword = function(id) {
            $uibModal.open({
                animation: true,
                size: 'sm',
                controller: 'ChangePasswordCtrl',
                templateUrl: 'app/pages/users/changePassword.html',
                resolve: {
                    user_id: function() {
                        return id
                    }
                }
            }).result.then(function(data) {

            });
        };
        
        $scope.resendmailModal = function(userId){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                controller: 'UserMailModalCtrl',
                templateUrl: 'app/pages/users/mailModal.html',
                resolve: {
                }
            }).result.then(function(data) {
                data.userId = userId;
                
                if(data.sendMail == 1){
                    $scope.resendEmail(data);
                }
            });
        }

        $scope.resendEmail = function(mailInfo) {
            $scope.users[mailInfo.userId].isSubmitted = true;
            var data = {id:mailInfo.userId, sendMail:mailInfo.sendMail, mailSubject: mailInfo.mailSubject, mailContent: mailInfo.mailContent};
            UsersFactory.resendEmail(data).success(function (res) { 
                Notification.success(res.success);
                $scope.users[mailInfo.userId].isSubmitted = false;
            }).error(function (err) {
                $scope.users[mailInfo.userId].isSubmitted = false;
                Notification.error(err.error);
            });
        };
        
        $scope.roleRender = function(data, type, full) {
            if (data) {
                var role = data.role.split('||');
                return role[1];
            } else {
                return "-";
            }
        };

        $scope.deleteRecord = function(id) {
            UsersFactory.deleteRecord(id).success(function (res) {
                Notification.success(res.success);
                $state.reload();
            }).error(function (err) {
                Notification.error(err.error);
            });
        }

        $scope.actionRoles = function (data, type, full) {
            if(full.is_editable != false) {
                var reLink = '';
                if (!full.mobile) {
                    $scope.users[full.id] = full;
                    $scope.users[full.id].isSubmitted = false;
                    reLink = "<a ng-if=\"havePermission('users','resend.email');\" class='cursor-pointer' ng-hide='users[" + full.id + "].isSubmitted' style='cursor:pointer' ng-click='resendmailModal(" + full.id + ")' title='Resend Email'><i class='fa fa-repeat'></i></a> ";

                    // return "<a ui-sref='users.viewdetails({ id: " + full.id + " })'><i class='fa fa-eye'></i></a> <a ui-sref='users.edit({ id: " + full.id + " })'><i class='fa fa-edit'></i></a> <a ng-click='changePassword(" + full.id + ")' title='Change Password'><i class='fa fa-cog'></i></a> <a class='cursor-pointer' ng-hide='users[" + full.id + "].isSubmitted' style='cursor:pointer' ng-click='resendEmail(" + full.id + ")' title='Resend Email'><i class='ion-repeat'></i></a>";    
                }
                return "<a ng-if=\"havePermission('users','view');\" ui-sref='users.viewdetails({ id: " + full.id + " })'><i class='fa fa-eye'></i></a> <a ng-if=\"havePermission('users','update');\" ui-sref='users.edit({ id: " + full.id + " })'><i class='fa fa-edit'></i></a> <a ng-click='changePassword(" + full.id + ")' ng-if=\"havePermission('users','update.password');\" title='Change Password'><i class='fa fa-key'></i></a> <a ng-if=\"havePermission('users','delete');\" class='cursor-pointer' style='cursor:pointer' ng-confirm-click='Are you sure to delete this user?' confirmed-click='deleteRecord(" + full.id + ")' title='Delete User'><i class='fa fa-trash'></i></a> "+ reLink;
            }
            else {
                return "-";
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
                UsersFactory.showDataTable(data).success(function (res) { 
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
            .withOption('order', [1, 'asc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('name').withTitle('Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('email').withTitle('Email').withOption('searchable', true),
            DTColumnBuilder.newColumn('mobile').withTitle('Mobile').withOption('searchable', true),
            DTColumnBuilder.newColumn('gender').withTitle('Gender').withOption('searchable', true),
            DTColumnBuilder.newColumn('role').withTitle('Role').withOption('searchable', true),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).renderWith($scope.actionRoles).notSortable()
        ];
  }
})();