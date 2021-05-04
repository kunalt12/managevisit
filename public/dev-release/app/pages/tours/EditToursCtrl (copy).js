/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('EditToursCtrl', EditToursCtrl);

    /** @ngInject */
    function EditToursCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, $q, $route, baConfig) {
        $scope.pageName = 'Edit';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;
        $scope.showTable = false;

        $scope.smartTablePageSize = 5;

        $scope.activeTaskList = [];
        $scope.addTaskBtn = false;
        $scope.minDateMoment = moment().subtract('day');
        $scope.visitors = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];

        $scope.docList = [];
        $scope.notes = [];

        $scope.errorMessage = ToursFactory.validation;
        var $validationProvider = $injector.get('$validation');

        /** Get organization name when already used */
        $scope.organizationOption = [];
        ToursFactory.getOrganization().success(function(response) {
            $scope.organizationOption = $scope.organizationOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.managersOption = [{ name: 'Please select tour manager', id: null }];
        UsersFactory.getTourManager().success(function(response) {
            $scope.managersOption = $scope.managersOption.concat(response.data);
            $.each($scope.managersOption, function(i, el) {
                if ($scope.managersOption[i].id != undefined) {
                    if ($scope.managersOption[i].availability == 1) {
                        $scope.managersOption[i].isDisabled = true;
                    }
                }
            });
        }).error(function(error) {

        });

        $scope.residentSelected = function(selected) {
            if (selected) {
                if (selected.originalObject.organization) {
                    $scope.formscope.organization = selected.originalObject.organization;
                } else {
                    $scope.formscope.organization = selected.originalObject;
                }
            }
        }

        /** Start options */
        $scope.TransportOption = [{ name: 'Please select transport type', id: null }];
        TransportsFactory.getRecords().success(function(response) {
            $scope.TransportOption = $scope.TransportOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.TourTypeOption = [{ name: 'Please select tour type', id: null }];
        TourtypesFactory.getRecords().success(function(response) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.OrganizationTypeOption = [{ name: 'Please select organization type', id: null }];
        OrganizationsFactory.getRecords().success(function(response) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.mealsTypeOption = [{ name: 'Please select meal type', id: null }];
        MealsFactory.getRecords().success(function(response) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.locationsTypeOption = [{ name: 'Please select location', id: null }];
        LocationsFactory.getRecords().success(function(response) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(response.data);
        }).error(function(error) {

        });

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

        $scope.VisitorOption = [{ name: 'Please sele$scope.urlIDct visitor type', id: null }];
        VisitorsFactory.getRecords().success(function(response) {
            $scope.VisitorOption = $scope.VisitorOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.usersOption = [{ name: 'Please select catering manager', id: null }];
        UsersFactory.getRecords().success(function(response) {
            $scope.usersOption = $scope.usersOption.concat(response.data);
        }).error(function(error) {

        });
        /** End options */

        $scope.$watch("formscope.tourtype_id", function(newValue, oldValue) {
            if (newValue) {
                $scope.activeTaskList = [];
                DefaulttasksFactory.getRecords(newValue).success(function(response) {
                    $scope.taskList = response.data;
                    for (var i = 0; i < $scope.taskList.length; i++) {
                        if ($scope.taskList[i].status == 1) {
                            var activeTask = {
                                task: $scope.taskList[i].task,
                                status: 1
                            };
                            $scope.activeTaskList.push(activeTask);
                        }
                    }
                }).error(function(error) {

                });
                $scope.addTaskBtn = true;
            } else {
                $scope.addTaskBtn = false;
                $scope.activeTaskList = [];
            }
        });

        $scope.unconnect = function(item) {
            $scope.activeTaskList.splice(item, 1);
        };

        $scope.connect = function(item) {
            $scope.activeTaskList[addVisitoritem].status = 1;
        };

        $scope.showModal = function(item) {
            $uibModal.open({
                animation: true,
                controller: 'AddTaskModalCtrl',
                templateUrl: 'app/pages/tours/taskModal.html'
            }).result.then(function(taskName) {
                var activeTask = {
                    task: taskName,
                    status: 1
                };
                $scope.activeTaskList.push(activeTask);
            });
        };

        $scope.addVisitor = function(item) {
            $scope.urlID
            $uibModal.open({
                animation: true,
                size: 'lg',
                controller: 'AddVisitorModalCtrl',
                templateUrl: 'app/pages/tours/visitorModal.html',
                resolve: {
                    organizationName: function() {
                        return $scope.formscope.organization
                    },
                    organizationNameData: function() {
                        return $scope.organizationOption
                    },
                    visitorInfo: function() {
                        return null
                    },
                }
            }).result.then(function(data) {
                var duplicateVisitor = false;
                $scope.showTable = false;
                $.each($scope.visitors, function(i, el) {
                    if ($scope.visitors[i].id != undefined) {
                        if ($scope.visitors[i].id === data.id) {
                            duplicateVisitor = true;
                        }
                    }
                });

                if (duplicateVisitor) {
                    Notification.error("The visitor you have entered already exist");
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);

                } else {
                    $scope.visitors.push(data);
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                }
            });
        };

        /*$scope.removeVisitor = function(index) {
             $scope.visitors.splice(index, 1);
        };*/

        $scope.editVisitor = function(visitorData, index) {
            $uibModal.open({
                animation: true,
                size: 'lg',
                controller: 'AddVisitorModalCtrl',
                templateUrl: 'app/pages/tours/visitorModal.html',
                resolve: {
                    organizationName: function() {
                        return $scope.formscope.organization
                    },
                    organizationNameData: function() {
                        return $scope.organizationOption
                    },
                    visitorInfo: function() {
                        return visitorData
                    },
                }
            }).result.then(function(data) {
                $scope.urlID
                var duplicateVisitor = false;
                $scope.showTable = false;

                $.each($scope.visitors, function(i, el) {
                    if ($scope.visitors[i].id != undefined) {
                        if ($scope.visitors[i].id === data.id) {
                            duplicateVisitor = true;
                        }
                    }
                });

                if (duplicateVisitor) {
                    Notification.error("The visitor you have entered already exist");
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                } else {
                    $scope.visitors[index] = data;
                    console.log($scope.visitors);
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                }
            });
            $scope.urlID
        };

        $scope.removeVisitor = function removeVisitor(row) {
            var index = $scope.visitors.indexOf(row);
            var visitorTourID = $scope.visitors[index].id;

            if (visitorTourID) {
                var queryData = {
                    tour_id: $scope.urlID,
                    visitor_id: visitorTourID
                }

                ToursFactory.deleteVisitor(queryData).success(function(response) {
                    $scope.visitorsOption = response.data;
                }).error(function(error) {

                });
            }

            if (index !== -1) {
                $scope.visitors.splice(index, 1);
                $scope.showTable = false;
                $timeout(function() {
                    $scope.$apply();
                    $scope.showTable = true;
                }, 100);
            }
        };

        $scope.addMeals = function(item) {
            $uibModal.open({
                animation: true,
                controller: 'AddMealModalCtrl',
                templateUrl: 'app/pages/tours/mealModal.html',
                resolve: {
                    meals: function() {
                        return $scope.mealsTypeOption
                    },
                    selectedMeals: function() {
                        return $scope.selectedMeals
                    }
                }
            }).result.then(function(data) {
                $scope.mealsType.push(data);

                $.each($scope.mealsTypeOption, function(i, el) {
                    if ($scope.mealsTypeOption[i].id != undefined) {
                        if ($scope.mealsTypeOption[i].id === data.meal_id) {
                            $scope.selectedMeals.push(data.meal_id);
                        }
                    }
                });
            });
        };

        $scope.removeMeal = function(mealsId) {
            $scope.mealsType.splice(mealsId, 1);
        };

        ToursFactory.getRecord($scope.urlID).success(function(response) {
            $timeout(function() {
                $scope.formscope = response.data;
                $scope.formscope.meals = (response.data.meals == 1) ? true : false;
                $scope.activeTask = response.data.tour_tasks;

                $scope.docList = $scope.formscope.tour_documents;
                $scope.notes = $scope.formscope.tour_notes;
                $scope.showTable = true;

                $.each(response.data.tour_visitors, function(i, el) {
                    if (response.data.tour_visitors[i].is_tour_admin == 1) {
                        response.data.contact_manager = response.data.tour_visitors[i].visitor.email;
                    }

                    response.data.tour_visitors[i].visitor.organization_txt = $scope.OrganizationTypeOption.filter(function(option) {
                        return option.id === response.data.tour_visitors[i].visitor.organization_id;
                    })[0].name;

                    response.data.tour_visitors[i].visitor.visitor_txt = $scope.VisitorOption.filter(function(option) {
                        return option.id === response.data.tour_visitors[i].visitor.visitor_type;
                    })[0].name;

                    $scope.visitors.push(response.data.tour_visitors[i].visitor);
                });

                $.each(response.data.tour_meals, function(i, el) {
                    $scope.selectedMeals.push(response.data.tour_meals[i].meal_id);
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
                });
                $scope.mealsType = response.data.tour_meals;
            }, 100);
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('tours.list');
        });

        $scope.add_data = function(form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form).success(function() {
                $scope.formscope.visitors = $scope.visitors;
                $scope.formscope.mealsType = $scope.mealsType;
                $scope.formscope.tasks = $scope.activeTaskList;

                $scope.formscope.documents = $scope.docList;
                $scope.formscope.notes = $scope.notes;

                $scope.formscope._method = 'PUT';

                ToursFactory.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('tours.list');
                    $scope.isSubmitted = false;
                }).error(function(err) {
                    Notification.error(err.error);
                    $scope.isSubmitted = false;
                });
            }).error(function(error) {
                console.log(error);
                $scope.isSubmitted = false;
            });
        };

        /** Add document link */
        $scope.deleteDocLInk = function(index) {
            $scope.docList.splice(index, 1);
        };

        $scope.addToDoItem = function(event, clickPlus) {
            // if (event.which === 13) {
            if ($scope.formscope.link) {
                $scope.docList.unshift({
                    link: $scope.formscope.link
                });
                $scope.formscope.link = '';
            }
            // }
        };

        $scope.deleteNote = function(index) {
            $scope.notes.splice(index, 1);
        };

        /** Add Notes */
        $scope.addNote = function(event, clickPlus) {
            // if (event.which === 13) {
            if ($scope.formscope.note) {
                $scope.notes.unshift({
                    note: $scope.formscope.note
                });
                $scope.formscope.note = '';
            }
            // }
        };
    }
})();