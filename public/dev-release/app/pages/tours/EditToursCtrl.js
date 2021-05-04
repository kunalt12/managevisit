/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('EditToursCtrl', EditToursCtrl);

    /** @ngInject */
    function EditToursCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, $q, $route, baConfig, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.pageName = 'Edit';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;
        $scope.showTable = false;
        $scope.loginID = $rootScope.auth_user.id;
        $scope.smartTablePageSize = 5;

        $scope.activeTaskList = [];
        $scope.addTaskBtn = false;
        $scope.minDateMoment = moment().subtract('day');
        $scope.visitors = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.userRoleID = Object.keys($rootScope.role)[0];

        $scope.documentDataFlag = false;
        $scope.edittourtype = false
        // $scope.documentInstance = {};

        /* Only for admin and tour manager */
        if ($scope.userRoleID == 1) {
            var statusPending = false,
                statusAcknowledge = false,
                statusApproved = false,
                statusRejected = false,
                statusCompleted = false;
        } else {
            var statusPending = true,
                statusAcknowledge = true,
                statusApproved = false,
                statusRejected = false,
                statusCompleted = false;
        }

        $scope.tourStatusOption = [
            { value: 0, label: 'Pending', isDisabled: statusPending },
            { value: 1, label: 'Acknowledge', isDisabled: statusAcknowledge },
            { value: 2, label: 'Approved', isDisabled: statusApproved },
            { value: 3, label: 'Rejected', isDisabled: statusRejected },
            { value: 4, label: 'Completed', isDisabled: statusCompleted }
        ];

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

        $scope.VisitorOption = [{ name: 'Please select visitor type', id: null }];
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
                size: 'lg',
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
                        return {}
                    },
                    isEdit: function() {
                        return true
                    }
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
                    $scope.visitors.splice(0, 0, data);
                    // $scope.visitors.push(data);
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                }
            });
        };

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
                    isEdit: function() {
                        return true
                    }
                }
            }).result.then(function(data) {
                var duplicateVisitor = false;
                $scope.showTable = false;
                
                $.each($scope.visitors, function(i, el) {
                    if ($scope.visitors[i].id != undefined) {
                        if ($scope.visitors[i].id === data.id && index != i) {
                            duplicateVisitor = true;
                        }
                    }
                });

                if (duplicateVisitor) {
                    Notification.error("The visitor you have entered already exist.");
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                } else {
                    $scope.visitors[index] = data;
                    $timeout(function() {
                        $scope.$apply();
                        $scope.showTable = true;
                    }, 100);
                }
            });
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
                backdrop: 'static',
                controller: 'AddMealModalCtrl',
                templateUrl: 'app/pages/tours/mealModal.html',
                resolve: {
                    meals: function() {
                        return $scope.mealsTypeOption
                    },
                    selectedMeals: function() {
                        return $scope.selectedMeals
                    },
                    mealData: function() {
                        return item;
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
                Notification.success('Meal added successfully.');
            });
        };
        
        $scope.editMeals = function(mealData, index) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                controller: 'AddMealModalCtrl',
                templateUrl: 'app/pages/tours/mealModal.html',
                resolve: {
                    meals: function() {
                        return $scope.mealsTypeOption;
                    },
                    selectedMeals: function() {
                        return $scope.selectedMeals;
                    },
                    mealData: function() {
                        return mealData;
                    }
                }
            }).result.then(function(data) {
                $scope.mealsType[index] = data;
                if(data.meal_id !== data.old_meal_id){
                    var uniqueIds = [];
                    $.each($scope.selectedMeals, function(i, el){
                        if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
                    });
                    $scope.selectedMeals = uniqueIds;
                    var removeIndex = $scope.selectedMeals.indexOf(data.old_meal_id);
                    $scope.selectedMeals.splice(removeIndex, 1);
                }
                $.each($scope.mealsTypeOption, function(i, el) {
                    if ($scope.mealsTypeOption[i].id != undefined) {
                        if ($scope.mealsTypeOption[i].id === data.meal_id) {
                            $scope.selectedMeals.push(data.meal_id);
                        }
                    }
                });
                Notification.success('Meal updated successfully.');
            });
        };

        $scope.removeMeal = function(mealsId) {
            var uniqueIds = [];
            $.each($scope.selectedMeals, function(i, el){
                if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
            });
            $scope.selectedMeals = uniqueIds;
            var removeIndex = $scope.selectedMeals.indexOf($scope.mealsType[mealsId].meal_id);
            $scope.selectedMeals.splice(removeIndex, 1);
            $scope.mealsType.splice(mealsId, 1);
            Notification.success('Meal deleted successfully.');
        };

        $scope.showOrganizationTypeOption = function(user) {
            var selected = [];
            if (user.organization_id != null) {
                selected = $filter('filter')($scope.OrganizationTypeOption, { id: user.organization_id });
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showVisitorOption = function(user) {
            var selected = [];
            if (user.visitor_type != null) {
                selected = $filter('filter')($scope.VisitorOption, { id: user.visitor_type });
            }
            return selected.length ? selected[0].name : '-';
        };
        // showOrganizationTypeOption(user)
        $scope.docList = [];
        $scope.notes = [];

        ToursFactory.getRecord($scope.urlID).success(function(response) {
            $timeout(function() {
                $scope.formscope = response.data;
                $scope.formscope.meals = (response.data.meals == 1) ? true : false;
                $scope.activeTask = response.data.tour_tasks;

                $scope.docList = $scope.formscope.tour_documents;
                $scope.notes = $scope.formscope.tour_notes;

                if($scope.formscope.tourtype_id == null) {
                    $scope.edittourtype = true;
                }

                $.each($scope.notes, function(i, el) {
                    $scope.notes[i].name = $scope.notes[i].tour_notes_created.name;
                });

                $.each($scope.docList, function(i, el) {
                    $scope.docList[i].name = $scope.docList[i].tour_docs_created.name;
                });

                $scope.documentDataFlag = true;
                $scope.showTable = true;
                
                $.each(response.data.tour_visitors_edit, function(i, el) {
                    if (response.data.tour_visitors_edit[i].is_tour_admin == 1) {
                        response.data.contact_manager = response.data.tour_visitors_edit[i].visitor.email;
                    }

                    /*response.data.tour_visitors_edit[i].visitor.organization_txt = $scope.OrganizationTypeOption.filter(function(option) {
                        return option.id === response.data.tour_visitors_edit[i].visitor.organization_id;
                    })[0].name;

                    response.data.tour_visitors_edit[i].visitor.visitor_txt = $scope.VisitorOption.filter(function(option) {
                        return option.id === response.data.tour_visitors_edit[i].visitor.visitor_type;
                    })[0].name;*/

                    $scope.visitors.push(response.data.tour_visitors_edit[i].visitor);
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

                if ($scope.formscope.meals) {
                    if ($scope.mealsType.length == 0) {
                        Notification.error("Please add meals first.");
                        $scope.isSubmitted = false;
                        return;
                    }
                }

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
                $scope.isSubmitted = false;
            });
        };

        /** Add document link */
        $scope.addDocument = function(item) {
            $uibModal.open({
                animation: true,
                controller: 'AddDocumentModalCtrl',
                templateUrl: 'app/pages/tours/documentModal.html',
                resolve: {
                    docLink: function() {
                        return ''
                    },
                    docTitle: function() {
                        return ''
                    },
                    docName: function() {
                        return ''
                    }
                }
            }).result.then(function(data) {
                data.tour_id = $scope.urlID;

                var duplicateDocTitle = false, duplicateDocLink = false;

                $.each($scope.docList, function(i, el) {
                    if ($scope.docList[i].title.toLowerCase() === data.title.toLowerCase()) {
                        duplicateDocTitle = true;
                    } else if ($scope.docList[i].link === data.link) {
                        duplicateDocLink = true;
                    }
                });

                if (duplicateDocTitle) {
                    Notification.error("The document title you have entered already exist");
                } else if (duplicateDocLink) {
                    Notification.error("The document link you have entered already exist");
                } else {
                    ToursFactory.tourDocument(data).success(function(res) {
                        Notification.success(res.success);
                        res.data.name = data.name;
                         $scope.docList.splice(0, 0, res.data);
                        // $scope.docList.push(res.data);
                    }).error(function(err) {
                        Notification.error(err.error);
                    });
                    // $timeout(function() {
                    //     $scope.$apply();
                    //     $scope.showTable = true;
                    // }, 100);
                }
            });
        };

        $scope.editDocument = function(docData, index) {
            $uibModal.open({
                animation: true,
                controller: 'AddDocumentModalCtrl',
                templateUrl: 'app/pages/tours/documentModal.html',
                resolve: {
                    docLink: function() {
                        return docData.link
                    },
                    docTitle: function() {
                        return docData.title
                    },
                    docName: function() {
                        return docData.name
                    }
                }
            }).result.then(function(data) {
                data.tour_id = $scope.urlID;
                data.id = docData.id;

                data.created_by = $scope.loginID;
                var duplicateDocTitle = false, duplicateDocLink = false;

                $.each($scope.docList, function(i, el) {
                    if ($scope.docList[i].title.toLowerCase() === data.title.toLowerCase() && index != i) {
                        duplicateDocTitle = true;
                    } else if ($scope.docList[i].link === data.link && index != i) {
                        duplicateDocLink = true;
                    }
                });

                if (duplicateDocTitle) {
                    Notification.error("The document title you have entered already exist");
                } else if (duplicateDocLink) {
                    Notification.error("The document link you have entered already exist");
                } else {
                    ToursFactory.tourDocument(data).success(function(res) {
                        Notification.success(res.success);
                        $scope.docList[index] = res.data;
                        $scope.docList[index].name = docData.name;
                    }).error(function(err) {
                        Notification.error(err.error);
                    });

                    // $timeout(function() {
                    //     $scope.$apply();
                    //     $scope.showTable = true;
                    // }, 100);
                }

            });
        };

        $scope.removeDoc = function(docId) {
            var deleteDoc = { id: $scope.docList[docId].id };
            ToursFactory.deleteDocument(deleteDoc).success(function(res) {
                Notification.success(res.success);
                $scope.docList.splice(docId, 1);
            }).error(function(err) {
                Notification.error(err.error);
            });

            // $timeout(function() {
            //     $scope.$apply();
            // }, 100);
        };
        /** End Add document link */

        /** Add document link */
        $scope.addNote = function(item) {
            $uibModal.open({
                animation: true,
                controller: 'AddNoteModalCtrl',
                templateUrl: 'app/pages/tours/noteModal.html',
                resolve: {
                    notesInfo: function() {
                        return ''
                    },
                    notesName: function() {
                        return ''
                    }
                }
            }).result.then(function(data) {
                // $scope.notes.push(data);
                data.tour_id = $scope.urlID;

                ToursFactory.tourNote(data).success(function(res) {
                    Notification.success(res.success);
                    res.data.name = data.name;
                    $scope.notes.splice(0, 0, res.data);
                    // $scope.notes.push(res.data);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            });
        };

        $scope.editNote = function(noteData, index) {
            $uibModal.open({
                animation: true,
                controller: 'AddNoteModalCtrl',
                templateUrl: 'app/pages/tours/noteModal.html',
                resolve: {
                    notesInfo: function() {
                        return noteData.note
                    },
                    notesName: function() {
                        return noteData.name
                    }
                }
            }).result.then(function(data) {
                $scope.showTable = false;
                data.tour_id = $scope.urlID;
                data.id = noteData.id;

                ToursFactory.tourNote(data).success(function(res) {
                    Notification.success(res.success);
                    $scope.notes[index] = res.data;
                    $scope.notes[index].name = noteData.name;
                }).error(function(err) {
                    Notification.error(err.error);
                });

                // $timeout(function() {
                //     $scope.$apply();
                //     $scope.showTable = true;
                // }, 100);
            });
        };

        $scope.removeNotes = function(noteId) {
            var deleteDoc = { id: $scope.notes[noteId].id };
            ToursFactory.deleteNote(deleteDoc).success(function(res) {
                Notification.success(res.success);
                $scope.notes.splice(noteId, 1);
            }).error(function(err) {
                Notification.error(err.error);
            });

            // $timeout(function() {
            //     $scope.$apply();
            // }, 100);
        };

        /** End Add document link */
        $scope.documentOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];

        $scope.notesOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.notesColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];

        $scope.visitorOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.visitorColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7)
        ];
    }
})();