/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddMealModalCtrl', AddMealModalCtrl);

    /** @ngInject */
    function AddMealModalCtrl($scope, $rootScope, $compile, $injector, MealsFactory, UsersFactory, MealservicelocationsFactory, MealservicetypesFactory, $uibModalInstance, Notification, ToursFactory, meals, selectedMeals, mealData) {
        $scope.btnName = "Add";
        $scope.formTitle = "Add";
        $scope.isSubmitted = !1;
        $scope.mealServiceTypeDescription;
        $scope.formscope = {
            meal_id: null,
            old_meal_id: null,
            meal_service_type_id: null,
            meal_service_location_id: null,
            catering_manager: null
        };
        var g = 0;
        if (mealData) {
            $scope.btnName = 'Update';
            $scope.formTitle = 'Edit';
            $scope.formscope.meal_id = mealData.meal_id;
            $scope.formscope.meal_service_type_id = mealData.meal_service_type_id;
            $scope.formscope.meal_service_location_id = mealData.meal_service_location_id;
            $scope.formscope.catering_manager = mealData.catering_manager;
            $scope.formscope.people = mealData.people;
            $scope.formscope.specific_item = mealData.specific_item;
            $scope.formscope.old_meal_id = mealData.meal_id;
            g = mealData.meal_id;
        }


        if (0 == selectedMeals.length) {
            $.each(meals, function (e, t) {
                delete meals[e].isDisabled
            })
        } else {
            $.each(meals, function (e, t) {
                void 0 != meals[e].id && (delete meals[e].isDisabled, $.inArray(parseInt(meals[e].id), selectedMeals) >= 0 && meals[e].id != g && (meals[e].isDisabled = !0))
            });
        }
        $scope.mealsTypeOption = meals;
        $scope.mealServiceTypeOption = [{
            name: "Please select meal service type",
            id: null
        }];
        MealservicetypesFactory.getRecords().success(function (t) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealServiceLocationsOption = [{
            name: "Please select meal service location",
            id: null
        }];
        MealservicelocationsFactory.getRecords().success(function (t) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(t.data);
            if(mealData) {
                var serviceType = $scope.mealServiceLocationsOption.find(function (service) {
                    return service.id == mealData.meal_service_type_id;
                });
                if(serviceType) {
                    $scope.mealServiceTypeDescription = serviceType.description;
                }
            }
        }).error(function (e) {});
        $scope.usersOption = [{
            name: "Please select catering manager",
            id: null
        }];
        UsersFactory.getRecords().success(function (t) {
            $scope.usersOption = $scope.usersOption.concat(t.data);
            $.each($scope.usersOption, function (t, a) {
                void 0 != $scope.usersOption[t].id && 1 == $scope.usersOption[t].availability && ($scope.usersOption[t].isDisabled = !0)
            })
        }).error(function (e) {});
        $scope.checkNumber = function (t) {
            $scope.formscope.people && (0 == $scope.formscope.people.charAt(0)) && ($scope.formscope.people = "");
        };
        $scope.mealServiceTypeChanged = function(id) {
            var serviceType = $scope.mealServiceTypeOption.find(function (f) {
                return f.id == id;
            });
            if(serviceType) {
                $scope.mealServiceTypeDescription = serviceType.description;
            }
        };
        var f = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation;
        $scope.add_data = function (t) {
            f.validate(t).success(function () {
                return "0" != $scope.formscope.people && 0 != $scope.formscope.people && "" != $scope.formscope.people && ($scope.formscope.meal_txt = $scope.mealsTypeOption.filter(function (t) {
                    return t.id === $scope.formscope.meal_id
                })[0].name,
                $scope.formscope.mealservice_txt = $scope.mealServiceTypeOption.filter(function (t) {
                    return t.id === $scope.formscope.meal_service_type_id
                })[0].name,
                $scope.formscope.meallocation_txt = $scope.mealServiceLocationsOption.filter(function (t) {
                    return t.id === $scope.formscope.meal_service_location_id
                })[0].name,
                $scope.formscope.catering_manager_txt = $scope.usersOption.filter(function (t) {
                    return t.id === $scope.formscope.catering_manager
                })[0].name,
                void $uibModalInstance.close($scope.formscope))
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();