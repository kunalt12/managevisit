/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.roles')
    .controller('RolesCtrl', RolesCtrl);

  /** @ngInject */
  function RolesCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, RolesFactory, $timeout, ngDialog, Notification) {
        $scope.dtInstance = {};
        
        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        };

        $scope.createdRow = function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        $scope.showPermissions = function (data, type, full) {
            return "<a href='javascript:void(0);' ng-click='getPermissions(" + full.id + ")'>Show Permissions</a>";
            // return "<a href='javascript:void(0);' data-toggle='modal' ng-click='open(\"app/pages/roles/modal/showPermissions.html\", \"md\")'>Show Permissions</a>";
            // <button type="button" class="btn btn-primary" data-toggle="modal" ng-click="open('app/pages/ui/modals/modalTemplates/basicModal.html', 'md')">Default modal</button>
        };

        $scope.getPermissions = function (roleId) {
            ngDialog.open({
                template: 'app/pages/roles/modal/showPermissions.html',
                scope: $scope,
                controller: ['$scope', 'RolesFactory', 'id', function ($scope, RolesFactory, id) {
                        $scope.role = {};
                        RolesFactory.getRolePermisssions(id).success(function (response) {
                            $scope.role.permissions = response;
                        }).error(function (error) {

                        });
                    }],
                resolve: {
                    id: function depFactory() {
                        return roleId;
                    }
                }
            });
        };

        $scope.deleteRecord = function(id) {
            RolesFactory.deleteRecord(id).success(function (res) {
                Notification.success(res.success);
                $state.reload();
            }).error(function (err) {
                Notification.error(err.error);
            });
        }

        $scope.actionRoles = function (data, type, full) {
            if(full.is_editable != false) {
                return "<a ui-sref='roles.edit({ id: " + full.id + " })'><i class='fa fa-edit'></i></a> <a class='cursor-pointer' ng-if=\"havePermission('roles','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this role?' confirmed-click='deleteRecord(" + full.id + ")' title='Delete role'><i class='fa fa-trash'></i></a>";
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
                  // map your server's response to the DataTables format and pass it to
                RolesFactory.showDataTable(data).success(function (res) { 
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
            .withOption('order', [0, 'asc'])
            .withDOM('lftip')
            .withOption('searchDelay', 500)
            .withOption('createdRow', $scope.createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('No').withOption('searchable', false).renderWith($scope.indexNumber).withClass('table-index'),
            DTColumnBuilder.newColumn('name').withTitle('Role Name'),
            /*DTColumnBuilder.newColumn('slug').withTitle('Slug Name'),*/
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('created_at').withTitle('Role Created On').withOption('searchable', true),
            /*DTColumnBuilder.newColumn('updated_at').withTitle('Role Created On').withOption('searchable', false),*/
            DTColumnBuilder.newColumn('count').withTitle('Total Permissions').withOption('searchable', false).renderWith($scope.showPermissions).notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).renderWith($scope.actionRoles).notSortable()
        ];
  }
})();
