/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';
    //   4.20

    angular.module('BlurAdmin.pages.tours')
        .controller('ViewToursCtrl', ViewToursCtrl);

    /** @ngInject */
    function ViewToursCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.pageName = '';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;
        $scope.showTable = true;
        $scope.smartTablePageSize = 5;
        $scope.smartTablePageSize1 = 10;
        $scope.loginID = $rootScope.auth_user.id;
        $scope.userID = $rootScope.auth_user.id;

        $scope.activeTaskList = [];
        $scope.addTaskBtn = false;
        $scope.minDateMoment = moment().subtract('day');
        $scope.visitors = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.userRoleID = Object.keys($rootScope.role)[0];

        $scope.tourCompleted = true;
        $scope.editTourBtn = false;

        $scope.genderOption = [
            { label: '-', value: '' },
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' }
        ];

        $scope.statusOption = [
            { label: 'Pending', value: '0' },
            { label: 'Acknowledge', value: '1' },
            { label: 'Rejected', value: '2' }
        ];

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

        $scope.changeStatus = function(updatedStatus) {
            $uibModal.open({
                animation: true,
                controller: 'AddCommentModalCtrl',
                templateUrl: 'app/pages/tours/commentModal.html'
            }).result.then(function(commentforacknowledge) {
                if(updatedStatus == 1 || updatedStatus == 2 || updatedStatus == 3 || updatedStatus == 4){
                    $scope.mailModal(commentforacknowledge, updatedStatus);                    
                }else{
                    var data = {
                        id: $scope.urlID,
                        action: updatedStatus,
                        comment: commentforacknowledge
                    };

                    ToursFactory.actionRecord(data).success(function(res) {
                        Notification.success(res.success);
                        $scope.reloadData();
                    }).error(function(err) {
                        Notification.error(err.error);
                    });
                }
            });
        };
        
        $scope.mailModal = function(commentforacknowledge, updatedStatus){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                controller: 'TourMailModalCtrl',
                templateUrl: 'app/pages/tours/mailModal.html',
                resolve: {
                    tourStatus: function() {
                        return updatedStatus;
                    }
                }
            }).result.then(function(data) {
                var data = {
                        id: $scope.urlID,
                        action: updatedStatus,
                        comment: commentforacknowledge,
                        sendMail: data.sendMail,
                        mailSubject: data.mailSubject,
                        mailContent: data.mailContent
                    };

                    ToursFactory.actionRecord(data).success(function(res) {
                        Notification.success(res.success);
                        $scope.reloadData();
                    }).error(function(err) {
                        Notification.error(err.error);
                    });
            });
        }

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = DefaulttasksFactory.validation;

        /** Start options */
        $scope.TransportOption = [{ name: 'Please select transport type', id: null }];
        TransportsFactory.getAllRecords().success(function(response) {
            $scope.TransportOption = $scope.TransportOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.TourTypeOption = [{ name: 'Please select tour type', id: null }];
        TourtypesFactory.getAllRecords().success(function(response) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.OrganizationTypeOption = [{ name: 'Please select organization type', id: null }];
        OrganizationsFactory.getAllRecords().success(function(response) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.mealsTypeOption = [{ name: 'Please select meal type', id: null }];
        MealsFactory.getAllRecords().success(function(response) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.locationsTypeOption = [{ name: 'Please select location', id: null }];
        LocationsFactory.getAllRecords().success(function(response) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.mealServiceTypeOption = [{ name: 'Please select meal service type', id: null }];
        MealservicetypesFactory.getAllRecords().success(function(response) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.mealServiceLocationsOption = [{ name: 'Please select meal service location', id: null }];
        MealservicelocationsFactory.getAllRecords().success(function(response) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.VisitorOption = [{ name: 'Please select visitor type', id: null }];
        VisitorsFactory.getAllRecords().success(function(response) {
            $scope.VisitorOption = $scope.VisitorOption.concat(response.data);
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

        $scope.volunteersOption = [{ name: 'Please select volunteers', id: null }];
        UsersFactory.getVolunteers().success(function(response) {
            $scope.volunteersOption = $scope.volunteersOption.concat(response.data);
            $.each($scope.volunteersOption, function(i, el) {
                if ($scope.volunteersOption[i].id != undefined) {
                    if ($scope.volunteersOption[i].availability == 1) {
                        $scope.volunteersOption[i].isDisabled = true;
                    }
                }
            });
        }).error(function(error) {

        });

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

        $scope.showUsers = function(user) {
            var selected = [];
            if (user.user_id) {
                selected = $filter('filter')($scope.volunteersOption, { id: user.user_id });
            }
            return selected.length ? selected[0].name : '-';
        };

        $scope.showStatus = function(user) {
            var selected = [];
            if (user.user_id) {
                if (user.user_id) {
                    selected = $filter('filter')($scope.statusOption, { value: user.acknowledge });
                }
                return selected.length ? selected[0].label : '-';
            } else {
                return '-';
            }
        };


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
        $scope.visitortypes = [];
        ToursFactory.getRecord($scope.urlID).success(function(response) {
            $timeout(function() {
                $scope.formscope = response.data;
                $scope.pageName = $scope.formscope.name;

                if($scope.formscope.tourtype_id == null) {
                    $scope.tourCompleted = false;
                }
                if (response.data.status == 4) {
                    $scope.tourCompleted = false;
                } else {
                    $scope.editTourBtn = true;
                }

                $scope.formscope.meals = (response.data.meals == 1) ? true : false;
                $scope.activeTask = response.data.tour_tasks;

                $scope.formscope.total_guest = Number($scope.formscope.adults) + Number($scope.formscope.children) + Number($scope.formscope.senior);

                $.each(response.data.tour_meals, function(i, el) {
                    /*response.data.tour_meals[i].meal_txt = $scope.mealsTypeOption.filter(function(option) {
                        return option.id === response.data.tour_meals[i].meal_id;
                    })[0].name;*/

                    /*response.data.tour_meals[i].mealservice_txt = $scope.mealServiceTypeOption.filter(function(option) {
                        return option.id === response.data.tour_meals[i].meal_service_type_id;
                    })[0].name;

                    response.data.tour_meals[i].meallocation_txt = $scope.mealServiceLocationsOption.filter(function(option) {
                        return option.id === response.data.tour_meals[i].meal_service_location_id;
                    })[0].name;*/

                    /*response.data.tour_meals[i].catering_manager_txt = $scope.usersOption.filter(function(option) {
                        return option.id === response.data.tour_meals[i].catering_manager;
                    })[0].name;*/
                });
                $scope.mealsType = response.data.tour_meals;

                $.each(response.data.tour_visitors_edit, function(i, el) {
                    if (response.data.tour_visitors_edit[i].is_tour_admin == 1) {
                        response.data.contact_manager = response.data.tour_visitors_edit[i].visitor.email;
                        $scope.contactManagerDetails = response.data.tour_visitors_edit[i];
                    }

                    /*response.data.tour_visitors_edit[i].visitor.gender_txt = $scope.genderOption.filter(function(option) {
                        return option.value === response.data.tour_visitors_edit[i].visitor.gender;
                    })[0].label;*/

                    /*response.data.tour_visitors_edit[i].visitor.organization_txt = $scope.OrganizationTypeOption.filter(function(option) {
                        return option.id === response.data.tour_visitors_edit[i].visitor.organization_id;
                    })[0].name;*/

                    response.data.tour_visitors_edit[i].visitor.visitor_txt = $scope.VisitorOption.filter(function(option) {
                        return option.id === response.data.tour_visitors_edit[i].visitor.visitor_type;
                    })[0].name;

                    var value = response.data.tour_visitors_edit[i].visitor.visitor_txt;
                    if ($.inArray(value, $scope.visitortypes) == -1) $scope.visitortypes.push(value);
                    $scope.visitors.push(response.data.tour_visitors_edit[i].visitor);
                });

                // console.log($scope.visitors);
                $scope.formscope.visitors = $scope.visitors;
                $scope.formscope.mealsType = $scope.mealsType;
                $scope.formscope.tasks = response.data.tour_tasks;
                $scope.activity = response.data.tour_history;

                $scope.docList = $scope.formscope.tour_documents;
                $scope.notes = $scope.formscope.tour_notes;

                $.each($scope.notes, function(i, el) {
                    $scope.notes[i].name = $scope.notes[i].tour_notes_created.name;
                });

                $.each($scope.docList, function(i, el) {
                    $scope.docList[i].name = $scope.docList[i].tour_docs_created.name;
                });

                $scope.visitorcategory = $scope.visitortypes.join('/');
            }, 500);
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('tours.list');
        });

        /*add Task*/
        $scope.addTask = function() {
            $scope.inserted = {
                id: null,
                task: '',
                user_id: null,
                acknowledge: 0
            };
            $scope.formscope.tasks.push($scope.inserted);
        };

        $scope.add_data = function(data, id, index) {
            if (id) {
                data.id = id;
                data.tour_name = $scope.formscope.name;
                data.user_name = $scope.showUsers(data);

                ToursFactory.updateTask(data).success(function(res) {
                    $scope.formscope.tasks[index].acknowledge = 0;
                    Notification.success(res.success);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            } else {
                data.tourtype_id = $scope.formscope.tour_tapes.id;
                data.tour_id = $scope.formscope.id;
                data.tour_name = $scope.formscope.name;
                data.user_name = $scope.showUsers(data);

                ToursFactory.addTask(data).success(function(res) {
                    $scope.formscope.tasks[index].id = res.data.id;
                    Notification.success(res.success);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            }
        };

        $scope.checkTask = function($data) {
            if ($data == '' || $data == null || $data == 'null') {
                return $scope.errorMessage.task.required;
            } else if ($data.length <= 2) {
                return $scope.errorMessage.task.minlength;
            } else if ($data.length >= 200) {
                return $scope.errorMessage.task.maxlength;
            }
        };

        $scope.removeUser = function(index, taskId) {
            if (taskId) {
                ToursFactory.deleteTask(taskId).success(function(res) {
                    Notification.success(res.success);
                    $scope.formscope.tasks.splice(index, 1);
                }).error(function(err) {
                    Notification.error(err.error);
                });
            } else {
                $scope.showTable = false;
                $scope.formscope.tasks.splice(index, 1);
                $timeout(function() {
                    $scope.$apply();
                    $scope.showTable = true;
                }, 100);
            }
        };

        $scope.cancelRow = function(index) {
            $scope.showTable = false;
            $scope.formscope.tasks.splice(index, 1);
            $scope.showTable = true;
        };

        $scope.actionTask = function(id, action, index) {
            var data = {
                id: id,
                task_name: $scope.formscope.tasks[index].task,
                status: action
            };

            ToursFactory.actionTask(data).success(function(res) {
                $scope.formscope.tasks[index].acknowledge = action;
                Notification.success(res.success);
            }).error(function(err) {
                Notification.error(err.error);
            });
        }

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

                var duplicateDocTitle = false,
                    duplicateDocLink = false;

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
                var duplicateDocTitle = false,
                    duplicateDocLink = false;

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
                    // $scope.notes.push(res.data);
                    $scope.notes.splice(0, 0, res.data);
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
        /*.withOption('order', [0, 'desc']);*/

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)
        ];

        $scope.notesOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.notesColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];

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

        $scope.historyOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple_numbers');

        $scope.historyColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1)
        ];
    }
})();