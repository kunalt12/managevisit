/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
    //   4.20

    angular.module('BlurAdmin.pages.tours')
        .controller('ViewToursCtrl', ViewToursCtrl);

    /** @ngInject */
    function ViewToursCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, EmailtemplatesFactory, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, MomentosFactory) {
        $scope.pageName = "";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.showTable = !0;
        $scope.smartTablePageSize = 5;
        $scope.smartTablePageSize1 = 10;
        $scope.loginID = $rootScope.auth_user.id;
        $scope.userID = $rootScope.auth_user.id;
        $scope.activeTaskList = [];
        $scope.addTaskBtn = !1;
        $scope.minDateMoment = moment().subtract("day");
        $scope.visitors = [];
        $scope.references = [];
        $scope.meetings = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.userRoleID = Object.keys($rootScope.role)[0];
        $scope.tourCompleted = !0;
        $scope.editTourBtn = !1;
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
        $scope.statusOption = [{
            label: "Pending",
            value: 0
        }, {
            label: "Confirmed",
            value: 1
        }, {
            label: "Rejected",
            value: 2
        }];
        if (1 == $scope.userRoleID) {
            var O = !1;
            var k = !1;
            var C = !1;
            var D = !1;
            var A = !1;
        } else {
            var O = !0;
            var k = !0;
            var C = !1;
            var D = !1;
            var A = !1;
        };
        EmailtemplatesFactory.getRecords().success(function (res) {
            $scope.tourStatusOption = res.data.filter(function (email) {
                return email.is_default;
            });
            $scope.tourStatusOption = $scope.tourStatusOption.sort(function (a, b) {
                return a.sort_by > b.sort_by;
            });
        }).error(function (err) {
            console.log(Error, err);
        });
        MomentosFactory.getRecords().success(function (t) {
            $scope.tourMomentoOptions = t.data;
        }).error(function (e) { });
        $scope.changeStatus = function (t) {
            console.log("Status Info : ", t);
            $uibModal.open({
                animation: !0,
                controller: "AddCommentModalCtrl",
                templateUrl: "app/pages/tours/commentModal.html",
                resolve: {
                    tourStatus: function () {
                        return $filter;
                    }
                }
            }).result.then(function (a) {
                if (1 == t || 2 == t || 3 == t || 4 == t) $scope.mailModal(a, t);
                else {
                    var o = {
                        id: $scope.urlID,
                        action: t,
                        comment: a
                    };
                    ToursFactory.actionRecord(o).success(function (t) {
                        Notification.success(t.success);
                        // $scope.reloadData();
                    }).error(function (e) {
                        Notification.error(e.error);
                    })
                }
            })
        };
        $scope.mailModal = function (t, a) {
            $uibModal.open({
                animation: !0,
                backdrop: "static",
                controller: "TourMailModalCtrl",
                templateUrl: "app/pages/tours/mailModal.html",
                resolve: {
                    tourStatus: function () {
                        return a
                    }
                }
            }).result.then(function (o) {
                var o = {
                    id: $scope.urlID,
                    action: o.status,
                    comment: t,
                    sendMail: o.sendMail,
                    mailSubject: o.mailSubject,
                    mailContent: o.mailContent
                };
                $scope.formscope.status = $scope.tourStatusOption[$scope.findIndexCustm(o.action, "emailtype", $scope.tourStatusOption)].emailtype;
                ToursFactory.actionRecord(o).success(function (t) {
                    Notification.success(t.success);
                    // $scope.reloadData();
                }).error(function (e) {
                    console.log("Error : ", e);
                    Notification.error(e.error);
                })
            })
        };
        $injector.get("$validation");
        $scope.errorMessage = DefaulttasksFactory.validation;
        $scope.TransportOption = [{
            name: "Please select transport type",
            id: null
        }];
        $scope.findIndexCustm = function (v, p, a) {
            for (var i = 0; i < a.length; i++) {
                if (a[i][p] === v) return i;
            }
            return -1;
        };
        TransportsFactory.getAllRecords().success(function (t) {
            $scope.TransportOption = $scope.TransportOption.concat(t.data);
        }).error(function (e) { });
        $scope.TourTypeOption = [{
            name: "Please select tour type",
            id: null
        }];
        TourtypesFactory.getAllRecords().success(function (t) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(t.data);
        }).error(function (e) { });
        $scope.OrganizationTypeOption = [{
            name: "Please select organization type",
            id: null
        }];
        OrganizationsFactory.getAllRecords().success(function (t) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(t.data);
        }).error(function (e) { });
        $scope.mealsTypeOption = [{
            name: "Please select meal type",
            id: null
        }];
        MealsFactory.getAllRecords().success(function (t) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(t.data);
        }).error(function (e) { });
        $scope.locationsTypeOption = [{
            name: "Please select location",
            id: null
        }];
        LocationsFactory.getAllRecords().success(function (t) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(t.data);
        }).error(function (e) { });
        $scope.mealServiceTypeOption = [{
            name: "Please select meal service type",
            id: null
        }];
        MealservicetypesFactory.getAllRecords().success(function (t) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(t.data);
        }).error(function (e) { });
        $scope.mealServiceLocationsOption = [{
            name: "Please select meal service location",
            id: null
        }];
        MealservicelocationsFactory.getAllRecords().success(function (t) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(t.data);
        }).error(function (e) { });
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }];
        VisitorsFactory.getAllRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data);
        }).error(function (e) { });
        $scope.usersOption = [{
            name: "Please select catering manager",
            id: null
        }];
        UsersFactory.getRecords().success(function (t) {
            $scope.usersOption = $scope.usersOption.concat(t.data), $.each($scope.usersOption, function (t, a) {
                void 0 != $scope.usersOption[t].id && 1 == $scope.usersOption[t].availability && ($scope.usersOption[t].isDisabled = !0)
            })
        }).error(function (e) { });
        $scope.volunteersOption = [{
            name: "Please select volunteers",
            id: null
        }], UsersFactory.getVolunteers($scope.urlID).success(function (t) {
            $scope.volunteersOption = $scope.volunteersOption.concat(t.data), $.each($scope.volunteersOption, function (t, a) {
                void 0 != $scope.volunteersOption[t].id && 1 == $scope.volunteersOption[t].availability && ($scope.volunteersOption[t].isDisabled = !0)
            })
        }).error(function (e) { });
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
        $scope.showUsers = function (t) {
            var o = [];
            if (t.user_id) {
                o = $scope.volunteersOption.filter(function (volunteer) {
                    return volunteer.id == t.user_id;
                });
            }
            if (o.length) {
                return o[0].name;
            } else {
                return "-";
            }
        };
        $scope.showStatus = function (t) {
            var o = [];
            return t.user_id ? (t.user_id && (o = $filter("filter")($scope.statusOption, {
                value: t.acknowledge
            })), o.length ? o[0].label : "-") : "-"
        };
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
        $scope.visitortypes = [], ToursFactory.getRecord($scope.urlID).success(function (t) {
            $timeout(function () {
                $scope.formscope = t.data;
                $scope.formscope.status = $scope.tourStatusOption[$scope.findIndexCustm(t.data.status, "emailtype", $scope.tourStatusOption)].emailtype;
                $scope.pageName = $scope.formscope.name;
                if (null == $scope.formscope.tourtype_id) {
                    ($scope.tourCompleted = !1);
                }
                if (4 == t.data.status) {
                    $scope.tourCompleted = !1;
                } else {
                    $scope.editTourBtn = !0;
                }
                $scope.formscope.meals = 1 == t.data.meals;
                $scope.activeTask = t.data.tour_tasks;
                $scope.formscope.total_guest = Number($scope.formscope.adults) + Number($scope.formscope.children) + Number($scope.formscope.senior);
                $.each(t.data.tour_meals, function (e, t) { });
                $scope.mealsType = t.data.tour_meals;
                $scope.tourFeedback = t.data.tour_feedback;
                $.each(t.data.tour_visitors_edit, function (a, o) {
                    if (1 == t.data.tour_visitors_edit[a].is_tour_admin) {
                        t.data.contact_manager = t.data.tour_visitors_edit[a].visitor.email;
                        $scope.contactManagerDetails = t.data.tour_visitors_edit[a];
                    };
                    var visitorOption = $scope.VisitorOption.filter(function (e) {
                        return $scope.id === t.data.tour_visitors_edit[a].visitor.visitor_type;
                    });
                    if (visitorOption.length > 0) {
                        t.data.tour_visitors_edit[a].visitor.visitor_txt = visitorOption[0].name;
                    }
                    var s = t.data.tour_visitors_edit[a].visitor.visitor_txt;
                    if ($.inArray(s, $scope.visitortypes) == -1) {
                        $scope.visitortypes.push(s);
                    }
                    $scope.visitors.push(t.data.tour_visitors_edit[a].visitor);
                });
                $scope.formscope.visitors = $scope.visitors;
                /////////

                $.each(t.data.tour_refference_edit, function (a, o) {
                    $scope.references.push(t.data.tour_refference_edit[a].refference);
                });
                $scope.formscope.references = $scope.references;


                $.each(t.data.tour_meeting_edit, function (a, o) {
                    $scope.meetings.push(t.data.tour_meeting_edit[a].meeting);
                });
                $scope.formscope.meetings = $scope.meetings;



                /////////////
                $scope.formscope.mealsType = $scope.mealsType;
                $scope.formscope.tasks = t.data.tour_tasks;
                $scope.activity = t.data.tour_history;
                $scope.docList = $scope.formscope.tour_documents;
                $scope.notes = $scope.formscope.tour_notes;
                $.each($scope.notes, function (t, a) {
                    $scope.notes[t].name = $scope.notes[t].tour_notes_created.name;
                });
                $.each($scope.docList, function (t, a) {
                    $scope.docList[t].name = $scope.docList[t].tour_docs_created.name;
                });
                $scope.visitorcategory = $scope.visitortypes.join("/");
                if ($scope.tourMomentoOptions) {
                    var momento = $scope.tourMomentoOptions.find(function (m) {
                        return m.id == $scope.formscope.momento_type;
                    });
                    if (momento) {
                        $scope.momentoLabel = momento.name;
                    } else {
                        $scope.momentoLabel = '';
                    }
                }
            }, 500);
        }).error(function (e) {
            Notification.error(e.error);
            $state.go("tours.list");
        });
        $scope.addTask = function () {
            $scope.inserted = {
                id: null,
                task: "",
                user_id: null,
                acknowledge: 0
            };
            $scope.formscope.tasks.push($scope.inserted);
        };
        $scope.addMeetings = function (t) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddMeetingModalCtrl",
                templateUrl: "app/pages/tours/meetingModal.html",
                resolve: {
                    meetingInfo: function () {
                        return {}
                    },
                    isEdit: function () {
                        return !1
                    }
                }
            }).result.then(function (t) {
                var a = !1;
                $scope.showMeetingTable = !1;
                $.each($scope.meetings, function (o, s) {
                    void 0 != $scope.meetings[o].id && $scope.meetings[o].id === t.id && (a = !0)
                });
                if(a) {
                    Notification.error("The meeting you have entered already exist");
                } else{
                    t.tourtype_id = $scope.formscope.tour_tapes.id;
                    t.tour_id = $scope.formscope.id;
                    t.tour_name = $scope.formscope.name;
                    ToursFactory.addMeeting(t).success(function (res) {
                        t.id = res.data.id;
                        $scope.meetings.splice(0, 0, t);
                        Notification.success(res.success);
                    }).error(function (e) {
                        Notification.error(e.error);
                    });
                }
                $timeout(function () {
                    $scope.$apply(), $scope.showMeetingTable = !0
                }, 100);
            })
        }, $scope.removeMeetings = function (t) {
            var a = $scope.meetings.indexOf(t);
            if(a !== -1) {
                ToursFactory.deleteMeeting(t.id).success(function (res) {
                    Notification.success(res.success);
                    $scope.meetings.splice(a, 1);
                }).error(function (e) {
                    Notification.error(e.error);
                });
            }
             $scope.showMeetingTable = !1;
            $timeout(function () {
                $scope.$apply(), $scope.showMeetingTable = !0;
            }, 100);
        }
        $scope.add_data = function (t, a, o) {
            if (a) {
                t.id = a;
                t.tour_name = $scope.formscope.name;
                t.user_name = $scope.showUsers(t);
                ToursFactory.updateTask(t).success(function (t) {
                    Notification.success(t.success);
                }).error(function (e) {
                    Notification.error(e.error);
                });
            } else {
                t.tourtype_id = $scope.formscope.tour_tapes.id;
                t.tour_id = $scope.formscope.id;
                t.tour_name = $scope.formscope.name;
                t.user_name = $scope.showUsers(t);
                ToursFactory.addTask(t).success(function (t) {
                    $scope.formscope.tasks[o].id = t.data.id;
                    Notification.success(t.success);
                }).error(function (e) {
                    Notification.error(e.error);
                });
            }
        }, $scope.checkTask = function (t) {
            return "" == t || null == t || "null" == t ? $scope.errorMessage.task.required : t.length <= 2 ? $scope.errorMessage.task.minlength : t.length >= 200 ? $scope.errorMessage.task.maxlength : void 0;
        }, $scope.removeUser = function (t, a) {
            if (a) {
                ToursFactory.deleteTask(a).success(function (a) {
                    Notification.success(a.success);
                    $scope.formscope.tasks.splice(t, 1);
                }).error(function (e) {
                    Notification.error(e.error);
                })
            } else {
                $scope.showTable = !1;
                $scope.formscope.tasks.splice(t, 1);
                $timeout(function () {
                    $scope.$apply(), $scope.showTable = !0
                }, 100);
            }
        }, $scope.cancelRow = function (t) {
            $scope.showTable = !1;
            $scope.formscope.tasks.splice(t, 1);
            $scope.showTable = !0;
        }, $scope.actionTask = function (t, a, o) {
            var s = {
                id: t,
                task_name: $scope.formscope.tasks[o].task,
                status: a
            };
            ToursFactory.actionTask(s).success(function (t) {
                $scope.formscope.tasks[o].acknowledge = a;
                Notification.success(t.success);
            }).error(function (e) {
                Notification.error(e.error);
            })
        }, $scope.addDocument = function (t) {
            $uibModal.open({
                animation: !0,
                controller: "AddDocumentModalCtrl",
                templateUrl: "app/pages/tours/documentModal.html",
                resolve: {
                    docLink: function () {
                        return ""
                    },
                    docTitle: function () {
                        return ""
                    },
                    docName: function () {
                        return ""
                    }
                }
            }).result.then(function (t) {
                t.tour_id = $scope.urlID;
                var a = !1,
                    o = !1;
                $.each($scope.docList, function (s, i) {
                    $scope.docList[s].title.toLowerCase() === t.title.toLowerCase() ? a = !0 : $scope.docList[s].link === t.link && (o = !0)
                });
                if (a) {
                    Notification.error("The document title you have entered already exist");
                } else if (o) {
                    Notification.error("The document link you have entered already exist");
                } else {
                    ToursFactory.tourDocument(t).success(function (a) {
                        Notification.success(a.success);
                        a.data.name = t.name;
                        $scope.docList.splice(0, 0, a.data);
                    }).error(function (e) {
                        Notification.error(e.error);
                    })
                }
            })
        }, $scope.editDocument = function (t, a) {
            $uibModal.open({
                animation: !0,
                controller: "AddDocumentModalCtrl",
                templateUrl: "app/pages/tours/documentModal.html",
                resolve: {
                    docLink: function () {
                        return t.link
                    },
                    docTitle: function () {
                        return t.title
                    },
                    docName: function () {
                        return t.name
                    }
                }
            }).result.then(function (o) {
                o.tour_id = $scope.urlID;
                o.id = t.id;
                o.created_by = $scope.loginID;
                var s = !1,
                    i = !1;
                $.each($scope.docList, function (t, r) {
                    $scope.docList[t].title.toLowerCase() === o.title.toLowerCase() && a != t ? s = !0 : $scope.docList[t].link === o.link && a != t && (i = !0)
                });
                if (s) {
                    Notification.error("The document title you have entered already exist");
                } else if (i) {
                    Notification.error("The document link you have entered already exist");
                } else {
                    ToursFactory.tourDocument(o).success(function (o) {
                        Notification.success(o.success);
                        $scope.docList[a] = o.data;
                        $scope.docList[a].name = t.name;
                    }).error(function (e) {
                        Notification.error(e.error);
                    });
                }
            })
        }, $scope.removeDoc = function (t) {
            var a = {
                id: $scope.docList[t].id
            };
            ToursFactory.deleteDocument(a).success(function (a) {
                Notification.success(a.success);
                $scope.docList.splice(t, 1);
            }).error(function (e) {
                Notification.error(e.error);
            })
        }, $scope.addNote = function (t) {
            $uibModal.open({
                animation: !0,
                controller: "AddNoteModalCtrl",
                templateUrl: "app/pages/tours/noteModal.html",
                resolve: {
                    notesInfo: function () {
                        return ""
                    },
                    notesName: function () {
                        return ""
                    }
                }
            }).result.then(function (t) {
                t.tour_id = $scope.urlID;
                ToursFactory.tourNote(t).success(function (a) {
                    Notification.success(a.success);
                    a.data.name = t.name;
                    $scope.notes.splice(0, 0, a.data);
                }).error(function (e) {
                    Notification.error(e.error);
                })
            })
        }, $scope.editNote = function (t, a) {
            $uibModal.open({
                animation: !0,
                controller: "AddNoteModalCtrl",
                templateUrl: "app/pages/tours/noteModal.html",
                resolve: {
                    notesInfo: function () {
                        return t.note
                    },
                    notesName: function () {
                        return t.name
                    }
                }
            }).result.then(function (o) {
                $scope.showTable = !1;
                o.tour_id = $scope.urlID;
                o.id = t.id;
                ToursFactory.tourNote(o).success(function (o) {
                    Notification.success(o.success);
                    $scope.notes[a] = o.data;
                    $scope.notes[a].name = t.name;
                }).error(function (e) {
                    Notification.error(e.error);
                })
            })
        }, $scope.removeNotes = function (t) {
            var a = {
                id: $scope.notes[t].id
            };
            ToursFactory.deleteNote(a).success(function (a) {
                Notification.success(a.success);
                $scope.notes.splice(t, 1);
            }).error(function (e) {
                Notification.error(e.error);
            })
        };
        $scope.documentOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)
        ];
        $scope.notesOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.notesColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];
        $scope.visitorOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.visitorColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];
        $scope.historyOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.historyColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1)
        ],
            $scope.referenceOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.referenceColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];
        $scope.meetingOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.meetingColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ]
    }
})();
