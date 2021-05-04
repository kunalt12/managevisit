/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddMealModalCtrl', AddMealModalCtrl);
    
    /** @ngInject */
    function AddMealModalCtrl($scope, $rootScope, $compile, $injector, MealsFactory, UsersFactory, MealservicelocationsFactory, MealservicetypesFactory, $uibModalInstance, Notification, ToursFactory, meals, selectedMeals, mealData) {
        $scope.btnName = 'Add';
        $scope.formTitle = 'Add';
        $scope.isSubmitted = false;
        $scope.formscope = {
            meal_id: null,
            old_meal_id: null,
            meal_service_type_id: null,
            meal_service_location_id: null,
            catering_manager: null,
        };
        var selectedMealId = 0;
        if(mealData){
            $scope.btnName = 'Update';
            $scope.formTitle = 'Edit';
            $scope.formscope.meal_id = mealData.meal_id;
            $scope.formscope.meal_service_type_id = mealData.meal_service_type_id;
            $scope.formscope.meal_service_location_id = mealData.meal_service_location_id;
            $scope.formscope.catering_manager = mealData.catering_manager;
            $scope.formscope.people = mealData.people;
            $scope.formscope.specific_item = mealData.specific_item;
            $scope.formscope.old_meal_id = mealData.meal_id;
            selectedMealId = mealData.meal_id;
        }
        
        if(selectedMeals.length == 0){
            $.each(meals, function(i, el) {
                delete meals[i].isDisabled;
            });
        }else{            
            $.each(meals, function(i, el) {
                if (meals[i].id != undefined) {
                    delete meals[i].isDisabled;
                    if ($.inArray(parseInt(meals[i].id), selectedMeals) >= 0) {
                        if(meals[i].id != selectedMealId){
                            meals[i].isDisabled = true;
                        }
                    }
                }
            });
        }
        
        $scope.mealsTypeOption = meals;

        // $scope.mealsTypeOption = [{name: 'Please select meal type', id: null}];
        // MealsFactory.getRecords().success(function(response) {
        //     $scope.mealsTypeOption = $scope.mealsTypeOption.concat(response.data);
        // }).error(function(error) {

        // });

        $scope.mealServiceTypeOption = [{ name: 'Please select meal service type', id: null }];
        MealservicetypesFactory.getRecords().success(function(response) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.mealServiceLocationsOption = [{ name: 'Please select meal service location', id: null }];
        MealservicelocationsFactory.getRecords().success(function(response) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.usersOption = [{ name: 'Please select catering manager', id: null }];
        UsersFactory.getRecords().success(function(response) {
            $scope.usersOption = $scope.usersOption.concat(response.data);

            $.each($scope.usersOption, function(i, el) {
                if ($scope.usersOption[i].id != undefined) {
                    if ($scope.usersOption[i].availability == 1) {
                        $scope.usersOption[i].isDisabled = true;
                    }
                }
            });
        }).error(function(error) {

        });

        $scope.checkNumber = function(e) {
            if($scope.formscope.people.charAt(0) == 0) {
                $scope.formscope.people = '';
            }
            
            /*if ($scope.formscope.people.length == 1 && (e.which == 96 || e.which == 48) ) {
                $scope.formscope.people = '';
                return false;
            }*/
        };

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = ToursFactory.validation;

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                if($scope.formscope.people == "0" || $scope.formscope.people == 0 || $scope.formscope.people == ''){
                    return false;
                }
                $scope.formscope.meal_txt = $scope.mealsTypeOption.filter(function(option) {
                    return option.id === $scope.formscope.meal_id;
                })[0].name;

                $scope.formscope.mealservice_txt = $scope.mealServiceTypeOption.filter(function(option) {
                    return option.id === $scope.formscope.meal_service_type_id;
                })[0].name;

                $scope.formscope.meallocation_txt = $scope.mealServiceLocationsOption.filter(function(option) {
                    return option.id === $scope.formscope.meal_service_location_id;
                })[0].name;

                $scope.formscope.catering_manager_txt = $scope.usersOption.filter(function(option) {
                    return option.id === $scope.formscope.catering_manager;
                })[0].name;

                $uibModalInstance.close($scope.formscope);
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
    }
})();