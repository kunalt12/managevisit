/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.contactmanagements')
    .controller('ListContactmanagementsCtrl', ListContactmanagementsCtrl);

  /** @ngInject */
  function ListContactmanagementsCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, Contactmanagement, $timeout, Notification) {
      $scope.dtInstance = {};

      $scope.reloadData = function() {
          $scope.dtInstance.rerender();
      };

      $scope.createdRow = function(row, data, dataIndex) {
           // Recompiling so we can bind Angular directive to the DT
           $compile(angular.element(row).contents())($scope);
      };

      $scope.deleteRecord = function(id) {
            Contactmanagement.deleteRecord(id).success(function (res) {
                Notification.success(res.success);
                $state.reload();
            }).error(function (err) {
                Notification.error(err.error);
            });
        }

      $scope.actionRoles = function(data, type, full) {
          return "<a ui-sref='contactmanagements.viewdetails({ id: " + full.id + " })'><i class='fa fa-eye'></i></a> <a ui-sref='contactmanagements.edit({ id: " + full.id + " })'><i class='fa fa-edit'></i></a> <a class='cursor-pointer' ng-if=\"havePermission('tours','delete');\" style='cursor:pointer' ng-confirm-click='Are you sure to delete this contact?' confirmed-click='deleteRecord(" + full.id + ")' title='Delete contact'><i class='fa fa-trash'></i></a>";
      };

      $scope.genderRender = function(data, type, full) {
        if (data == 'f') {
            return "Female";
        } else if (data == 'm') {
            return "Male";
        }
        else {
            return "-";
        }
      };
    
      $scope.statusAction = function(data, type, full) {
            if(data.status == '2') {
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
                Contactmanagement.showDataTable(data).success(function(res) {
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
            DTColumnBuilder.newColumn('email').withTitle('Email').withOption('searchable', true),
            DTColumnBuilder.newColumn('mobile').withTitle('Mobile').withOption('searchable', true),
            DTColumnBuilder.newColumn('visitordata.name').withTitle('Visitor Type').withOption('searchable', true),
            DTColumnBuilder.newColumn('organization').withTitle('Organization').withOption('searchable', true),
            DTColumnBuilder.newColumn('gender').withTitle('Gender').withOption('searchable', true),
            DTColumnBuilder.newColumn(null).withTitle('Status').withOption('searchable', false).notSortable().renderWith($scope.statusAction),
            DTColumnBuilder.newColumn(null).withTitle('Action').withOption('searchable', false).notSortable().renderWith($scope.actionRoles)
        ];
  }
})();