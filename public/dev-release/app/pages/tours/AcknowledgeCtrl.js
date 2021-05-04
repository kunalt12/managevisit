/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tours')
    .controller('AcknowledgeCtrl', AcknowledgeCtrl);

  /** @ngInject */
  function AcknowledgeCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.pageName = 'View';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.activeTaskList = [];
        $scope.addTaskBtn = false;
        $scope.minDateMoment = moment().subtract('day');
        $scope.visitors = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];

        $scope.showTable = true;
        $scope.smartTablePageSize = 5;

        $scope.genderOption = [
            {label: '-', value: ''},
            {label: 'Male', value: 'm'},
            {label: 'Female', value: 'f'}
        ];

        /** Start options */ 
        $scope.TransportOption = [{name: 'Please select transport type', id: null}];
        TransportsFactory.getAllRecords().success(function(response) {
            $scope.TransportOption = $scope.TransportOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.TourTypeOption = [{name: 'Please select tour type', id: null}];
        TourtypesFactory.getAllRecords().success(function(response) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.OrganizationTypeOption = [{name: 'Please select organization type', id: null}];
        OrganizationsFactory.getAllRecords().success(function(response) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.mealsTypeOption = [{name: 'Please select meal type', id: null}];
        MealsFactory.getAllRecords().success(function(response) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.locationsTypeOption = [{name: 'Please select location', id: null}];
        LocationsFactory.getAllRecords().success(function(response) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.mealServiceTypeOption = [{name: 'Please select meal service type', id: null}];
        MealservicetypesFactory.getAllRecords().success(function(response) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.mealServiceLocationsOption = [{name: 'Please select meal service location', id: null}];
        MealservicelocationsFactory.getAllRecords().success(function(response) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.VisitorOption = [{name: 'Please select visitor type', id:null}];
        VisitorsFactory.getAllRecords().success(function(response) {
            $scope.VisitorOption = $scope.VisitorOption.concat(response.data);
        }).error(function(error) {
            
        });
 
        $scope.usersOption = [{name: 'Please select catering manager', id: null}];
        UsersFactory.getRecords().success(function(response) {
            $scope.usersOption = $scope.usersOption.concat(response.data);
        }).error(function(error) {
            
        });


        $scope.showMealsTypeOption = function(user) {
            var selected = [];
            if (user.meal_id != null) {
                selected = $filter('filter')($scope.mealsTypeOption, { id: user.meal_id });
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showMealServiceTypeOption = function(user) {
            var selected = [];
            if (user.meal_service_type_id != null) {
                selected = $filter('filter')($scope.mealServiceTypeOption, { id: user.meal_service_type_id });
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showMealServiceLocationsOption = function(user) {
            var selected = [];
            if (user.meal_service_location_id != null) {
                selected = $filter('filter')($scope.mealServiceLocationsOption, { id: user.meal_service_location_id });
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showCateringManager = function(user) {
            var selected = [];
            if (user.catering_manager != null) {
                selected = $filter('filter')($scope.usersOption, { id: user.catering_manager });
            }
            return selected.length ? selected[0].name : '-';
        };
        /** End options */ 

        $scope.showOrganizationTypeOption = function(user) {
            var selected = [];
            if(user.organization_id != null) {
                selected = $filter('filter')($scope.OrganizationTypeOption, {id: user.organization_id});
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showVisitorOption = function(user) {
            var selected = [];
            if(user.visitor_type != null) {
                selected = $filter('filter')($scope.VisitorOption, {id: user.visitor_type});
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showGenderOption = function(user) {
            var selected = [];
            if(user.gender != null) {
                selected = $filter('filter')($scope.genderOption, {value: user.gender});
            }
            return selected.length ? selected[0].label : '-';
        };

        ToursFactory.viewRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
            $scope.formscope.meals = (response.data.meals == 1) ? true : false;
            $scope.activeTask = response.data.tour_tasks;
            
            /*$.each(response.data.tour_meals, function(i, el) {
                response.data.tour_meals[i].meal_txt = $scope.mealsTypeOption.filter(function(option) {
                    return option.id === response.data.tour_meals[i].meal_id;
                })[0].name;

                response.data.tour_meals[i].mealservice_txt = $scope.mealServiceTypeOption.filter(function(option) {
                    return option.id === response.data.tour_meals[i].meal_service_type_id;
                })[0].name;

                response.data.tour_meals[i].meallocation_txt = $scope.mealServiceLocationsOption.filter(function(option) {
                    return option.id === response.data.tour_meals[i].meal_service_location_id;
                })[0].name;

                response.data.tour_meals[i].catering_manager_txt = $scope.usersOption.filter(function(option) {
                    return option.id === response.data.tour_meals[i].catering_manager;
                })[0].name;
            });*/
            $scope.mealsType = response.data.tour_meals;

            $.each(response.data.tour_visitors, function(i, el) {
                /*response.data.tour_visitors[i].visitor.gender_txt = $scope.genderOption.filter(function(option) {
                    return option.value === response.data.tour_visitors[i].visitor.gender;
                })[0].label;*/

                /*response.data.tour_visitors[i].visitor.organization_txt = $scope.OrganizationTypeOption.filter(function(option) {
                    return option.id === response.data.tour_visitors[i].visitor.organization_id;
                })[0].name;*/

                /*response.data.tour_visitors[i].visitor.visitor_txt = $scope.VisitorOption.filter(function(option) {
                    return option.id === response.data.tour_visitors[i].visitor.visitor_type;
                })[0].name;*/

                if(response.data.tour_visitors[i].is_tour_admin == 1) {
                    response.data.contact_manager = response.data.tour_visitors[i].visitor.email;
                    $scope.contactManagerDetails = response.data.tour_visitors[i];

                    $scope.contactManagerDetails.address = ($scope.contactManagerDetails.visitor.address != '') ? $scope.contactManagerDetails.visitor.address+", " : '';
                    $scope.contactManagerDetails.address1 = ($scope.contactManagerDetails.visitor.address1 != '') ? $scope.contactManagerDetails.visitor.address1+", " : '';
                    $scope.contactManagerDetails.city = ($scope.contactManagerDetails.visitor.city != '') ? $scope.contactManagerDetails.visitor.city+", " : '';
                    $scope.contactManagerDetails.state = ($scope.contactManagerDetails.visitor.state != '') ? $scope.contactManagerDetails.visitor.state+", " : '';
                    $scope.contactManagerDetails.countryName = ($scope.contactManagerDetails.visitor.country != null) ? $scope.contactManagerDetails.visitor.country.country_name+", " : '';
                    $scope.contactManagerDetails.zip_code = ($scope.contactManagerDetails.visitor.zip_code != '') ? $scope.contactManagerDetails.visitor.zip_code : '';

                    $scope.contactManagerDetails.fullAddress = $scope.contactManagerDetails.address+$scope.contactManagerDetails.address1+$scope.contactManagerDetails.city+$scope.contactManagerDetails.state+$scope.contactManagerDetails.countryName+$scope.contactManagerDetails.zip_code;
                }

                $scope.visitors.push(response.data.tour_visitors[i].visitor);
            });

            // $timeout(function() {
                $scope.formscope.visitors = $scope.visitors;
                $scope.formscope.mealsType = $scope.mealsType;
                $scope.formscope.tasks = response.data.tour_tasks;
            // }, 3000);
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('tours.list');
        });

        $scope.approveRejectTour = function(value) {
            var data = {
                tour_id: $scope.urlID,
                action: value,
                name: $scope.contactManagerDetails.visitor.name,
                comment: $scope.formscope.comment
            };
            
            ToursFactory.actionRecord(data).success(function(res) {
                Notification.success(res.success);
                // $state.go('tours.list');
                $scope.formscope.status = value;
                $scope.isSubmitted = false;
            }).error(function(err) {
                Notification.error(err.error);
                $scope.isSubmitted = false;
            });
        }

        $scope.visitorOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.visitorColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];
  }
})();
