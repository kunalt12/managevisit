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
        $scope.pageName = "View";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.activeTaskList = [];
        $scope.addTaskBtn = !1;
        $scope.minDateMoment = moment().subtract("day");
        $scope.visitors = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.showTable = !0;
        $scope.smartTablePageSize = 5;
        $scope.genderOption = [{
            label: "-",
            value: ""
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }];
        $scope.TransportOption = [{
            name: "Please select transport type",
            id: null
        }], TransportsFactory.getAllRecords().success(function (t) {
            $scope.TransportOption = $scope.TransportOption.concat(t.data)
        }).error(function (e) {});
        $scope.TourTypeOption = [{
            name: "Please select tour type",
            id: null
        }], TourtypesFactory.getAllRecords().success(function (t) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.OrganizationTypeOption = [{
            name: "Please select organization type",
            id: null
        }], OrganizationsFactory.getAllRecords().success(function (t) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealsTypeOption = [{
            name: "Please select meal type",
            id: null
        }], MealsFactory.getAllRecords().success(function (t) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.locationsTypeOption = [{
            name: "Please select location",
            id: null
        }], LocationsFactory.getAllRecords().success(function (t) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealServiceTypeOption = [{
            name: "Please select meal service type",
            id: null
        }], MealservicetypesFactory.getAllRecords().success(function (t) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealServiceLocationsOption = [{
            name: "Please select meal service location",
            id: null
        }], MealservicelocationsFactory.getAllRecords().success(function (t) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(t.data)
        }).error(function (e) {});
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }], VisitorsFactory.getAllRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data)
        }).error(function (e) {});
        $scope.usersOption = [{
            name: "Please select catering manager",
            id: null
        }], UsersFactory.getRecords().success(function (t) {
            $scope.usersOption = $scope.usersOption.concat(t.data)
        }).error(function (e) {});
        $scope.showMealsTypeOption = function (t) {
            var o = [];
            return null != t.meal_id && (o = $filter("filter")($scope.mealsTypeOption, {
                id: t.meal_id
            })), o.length ? o[0].name : "-"
        };
        $scope.showMealServiceTypeOption = function (t) {
            var o = [];
            return null != t.meal_service_type_id && (o = $filter("filter")($scope.mealServiceTypeOption, {
                id: t.meal_service_type_id
            })), o.length ? o[0].name : "-"
        };
        $scope.showMealServiceLocationsOption = function (t) {
            var o = [];
            return null != t.meal_service_location_id && (o = $filter("filter")($scope.mealServiceLocationsOption, {
                id: t.meal_service_location_id
            })), o.length ? o[0].name : "-"
        };
        $scope.showCateringManager = function (t) {
            var o = [];
            return null != t.catering_manager && (o = $filter("filter")($scope.usersOption, {
                id: t.catering_manager
            })), o.length ? o[0].name : "-"
        };
        $scope.showOrganizationTypeOption = function (t) {
            var o = [];
            return null != t.organization_id && (o = $filter("filter")($scope.OrganizationTypeOption, {
                id: t.organization_id
            })), o.length ? o[0].name : "-"
        };
        $scope.showVisitorOption = function (t) {
            var o = [];
            return null != t.visitor_type && (o = $filter("filter")($scope.VisitorOption, {
                id: t.visitor_type
            })), o.length ? o[0].name : "-"
        };
        $scope.showGenderOption = function (t) {
                var o = [];
                return null != t.gender && (o = $filter("filter")($scope.genderOption, {
                    value: t.gender
                })), o.length ? o[0].label : "-"
            }, ToursFactory.viewRecord($scope.urlID).success(function (t) {
                $scope.formscope = t.data, $scope.formscope.meals = 1 == t.data.meals, $scope.activeTask = t.data.tour_tasks, $scope.mealsType = t.data.tour_meals, $.each(t.data.tour_visitors, function (a, o) {
                    1 == t.data.tour_visitors[a].is_tour_admin && (t.data.contact_manager = t.data.tour_visitors[a].visitor.email, $scope.contactManagerDetails = t.data.tour_visitors[a], $scope.contactManagerDetails.address = "" != $scope.contactManagerDetails.visitor.address ? $scope.contactManagerDetails.visitor.address + ", " : "", $scope.contactManagerDetails.address1 = "" != $scope.contactManagerDetails.visitor.address1 ? $scope.contactManagerDetails.visitor.address1 + ", " : "", $scope.contactManagerDetails.city = "" != $scope.contactManagerDetails.visitor.city ? $scope.contactManagerDetails.visitor.city + ", " : "", $scope.contactManagerDetails.state = "" != $scope.contactManagerDetails.visitor.state ? $scope.contactManagerDetails.visitor.state + ", " : "", $scope.contactManagerDetails.countryName = null != $scope.contactManagerDetails.visitor.country ? $scope.contactManagerDetails.visitor.country.country_name + ", " : "", $scope.contactManagerDetails.zip_code = "" != $scope.contactManagerDetails.visitor.zip_code ? $scope.contactManagerDetails.visitor.zip_code : "", $scope.contactManagerDetails.fullAddress = $scope.contactManagerDetails.address + $scope.contactManagerDetails.address1 + $scope.contactManagerDetails.city + $scope.contactManagerDetails.state + $scope.contactManagerDetails.countryName + $scope.contactManagerDetails.zip_code), $scope.visitors.push(t.data.tour_visitors[a].visitor)
                }), $scope.formscope.visitors = $scope.visitors, $scope.formscope.mealsType = $scope.mealsType, $scope.formscope.tasks = t.data.tour_tasks
            }).error(function (e) {
                Notification.error(e.error), $state.go("tours.list")
            }), $scope.approveRejectTour = function (t) {
                var a = {
                    tour_id: $scope.urlID,
                    action: t,
                    name: $scope.contactManagerDetails.visitor.name,
                    comment: $scope.formscope.comment
                };
                ToursFactory.actionRecord(a).success(function (a) {
                    console.log("Acknowlege............ "),
                    Notification.success(a.success), $scope.formscope.status = t, $scope.isSubmitted = 1;
                    // $state.go("tours.list");
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = 1
                })
            }, $scope.visitorOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers"),
            $scope.visitorColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ]
    }
})();