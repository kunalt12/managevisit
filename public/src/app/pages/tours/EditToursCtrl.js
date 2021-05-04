/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('EditToursCtrl', EditToursCtrl);

    /** @ngInject */
    function EditToursCtrl($scope, fileReader, $filter, AffiliationsFactory, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, editableOptions, editableThemes, $q, $route, baConfig, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, MomentosFactory) {
        // ---- Working Tour Edit Modal ---- //
        $scope.pageName = "Edit";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.showTable = !1;
        $scope.loginID = $rootScope.auth_user.id;
        $scope.smartTablePageSize = 5;
        $scope.activeTaskList = [];
        $scope.addTaskBtn = !1;
        $scope.minDateMoment = moment().subtract("day");
        $scope.visitors = [];
        $scope.references = [];
        $scope.meetings = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.userRoleID = Object.keys($rootScope.role)[0];
        $scope.documentDataFlag = !1;
        $scope.edittourtype = !1;
        if (1 == $scope.userRoleID) {
            var D = !1,
                A = !1,
                N = !1,
                R = !1,
                q = !1;
        } else {
            var D = !0,
                A = !0,
                N = !1,
                R = !1,
                q = !1;
        }
        $scope.tourStatusOption = [{
            value: 0,
            label: "Pending",
            isDisabled: D
        }, {
            value: 1,
            label: "Acknowledge",
            isDisabled: A
        }, {
            value: 2,
            label: "Approved",
            isDisabled: N
        }, {
            value: 3,
            label: "Rejected",
            isDisabled: R
        }, {
            value: 4,
            label: "Completed",
            isDisabled: q
        }],
            $scope.tourLanguageOption = [{
                value: 'english',
                label: "English",
                isDisabled: !1
            }, {
                value: 'gujarati',
                label: "Gujarati",
                isDisabled: !1
            }, {
                value: 'hindi',
                label: "Hindi",
                isDisabled: !1
            }];
        $scope.docList = [];
        $scope.notes = [];
        $scope.errorMessage = ToursFactory.validation;
        var z = $injector.get("$validation");
        $scope.organizationOption = [], ToursFactory.getOrganization().success(function (t) {
            $scope.organizationOption = $scope.organizationOption.concat(t.data)
        }).error(function (e) { });
        $scope.managersOption = [{
            name: "Please select tour manager",
            id: null
        }];
        $scope.tourMomentoOptions = [{
            name: "Please select a momento",
            id: null
        }], MomentosFactory.getRecords().success(function (t) {
            $scope.tourMomentoOptions = $scope.tourMomentoOptions.concat(t.data);
        }).error(function (e) { }), UsersFactory.getTourManager().success(function (t) {
            $scope.managersOption = $scope.managersOption.concat(t.data), $.each($scope.managersOption, function (t, a) {
                void 0 != $scope.managersOption[t].id && 1 == $scope.managersOption[t].availability && ($scope.managersOption[t].isDisabled = !0)
            })
        }).error(function (e) { });
        $scope.residentSelected = function (t) {
            t && (t.originalObject.organization ? $scope.formscope.organization = t.originalObject.organization : $scope.formscope.organization = t.originalObject)
        };
        $scope.TransportOption = [{
            name: "Please select transport type",
            id: null
        }], TransportsFactory.getRecords().success(function (t) {
            $scope.TransportOption = $scope.TransportOption.concat(t.data)
        }).error(function (e) { }),
            // $scope.AffiliateOption = [{
            //     name: "Please select an affiliate",
            //     id: null
            // }],
            //  affi.getRecords().success(function (t) {
            //     $scope.AffiliateOption = $scope.AffiliateOption.concat(t.data)
            // }).error(function (e) { }),
            $scope.TourTypeOption = [{
                name: "Please select tour type",
                id: null
            }];
        TourtypesFactory.getRecords().success(function (t) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(t.data)
        }).error(function (e) { });
        $scope.OrganizationTypeOption = [{
            name: "Please select organization type",
            id: null
        }];
        OrganizationsFactory.getRecords().success(function (t) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(t.data)
        }).error(function (e) { });
        $scope.mealsTypeOption = [{
            name: "Please select meal type",
            id: null
        }];
        MealsFactory.getRecords().success(function (t) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(t.data)
        }).error(function (e) { });
        $scope.locationsTypeOption = [{
            name: "Please select location",
            id: null
        }];
        LocationsFactory.getRecords().success(function (t) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(t.data)
        }).error(function (e) { });
        $scope.mealServiceTypeOption = [{
            name: "Please select meal service type",
            id: null
        }];
        MealservicetypesFactory.getRecords().success(function (t) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(t.data)
        }).error(function (e) { });
        $scope.mealServiceLocationsOption = [{
            name: "Please select meal service location",
            id: null
        }];
        MealservicelocationsFactory.getRecords().success(function (t) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(t.data)
        }).error(function (e) { });
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }];
        VisitorsFactory.getRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data)
        }).error(function (e) { });
        $scope.usersOption = [{
            name: "Please select catering manager",
            id: null
        }];
        UsersFactory.getRecords().success(function (t) {
            $scope.usersOption = $scope.usersOption.concat(t.data)
        }).error(function (e) { });
        $scope.$watch("formscope.tourtype_id", function (t, a) {
            t ? ($scope.activeTaskList = [], DefaulttasksFactory.getRecords(t).success(function (t) {
                $scope.taskList = t.data;
                for (var a = 0; a < $scope.taskList.length; a++)
                    if (1 == $scope.taskList[a].status) {
                        var o = {
                            task: $scope.taskList[a].task,
                            status: 1
                        };
                        $scope.activeTaskList.push(o)
                    }
            }).error(function (e) { }), $scope.addTaskBtn = !0) : ($scope.addTaskBtn = !1, $scope.activeTaskList = [])
        });
        $scope.unconnect = function (t) {
            $scope.activeTaskList.splice(t, 1)
        };
        $scope.connect = function (t) {
            $scope.activeTaskList[addVisitoritem].status = 1
        };
        $scope.showModal = function (t) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddTaskModalCtrl",
                templateUrl: "app/pages/tours/taskModal.html"
            }).result.then(function (t) {
                var a = {
                    task: t,
                    status: 1
                };
                $scope.activeTaskList.push(a)
            })
        },
            // ********************************************************************* //



            $scope.addReferences = function (t) {
                $uibModal.open({
                    animation: !0,
                    size: "lg",
                    controller: "AddReferenceModalCtrl",
                    templateUrl: "app/pages/tours/referenceModal.html",
                    resolve: {
                        referenceInfo: function () {
                            return {}
                        },
                        isEdit: function () {
                            return !1
                        }
                    }
                }).result.then(function (t) {
                    var a = !1;
                    $scope.showReferenceTable = !1, $.each($scope.references, function (o, s) {
                        void 0 != $scope.references[o].id && $scope.references[o].id === t.id && (a = !0)
                    }), a ? Notification.error("The reference you have entered already exist") : ($scope.references.splice(0, 0, t), $timeout(function () {
                        $scope.$apply(), $scope.showReferenceTable = !0
                    }, 100))
                })
            };
        $scope.editReference = function (t, a) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddReferenceModalCtrl",
                templateUrl: "app/pages/tours/referenceModal.html",
                resolve: {
                    referenceInfo: function () {
                        return t
                    },
                    isEdit: function () {
                        return !1
                    }
                }
            }).result.then(function (t) {
                var o = !1;
                $scope.showReferenceTable = !1, $.each($scope.references, function (s, i) {
                    void 0 != $scope.references[s].id && $scope.references[s].id === t.id && a != s && (o = !0)
                }), o ? (Notification.error("The reference you have entered already exist."), $timeout(function () {
                    $scope.$apply(), $scope.showReferenceTable = !0
                }, 100)) : ($scope.references[a] = t, $timeout(function () {
                    $scope.$apply(), $scope.showReferenceTable = !0
                }, 100))
            })
        };
        $scope.removeReference = function (t) {
            var a = $scope.references.indexOf(t);
            a !== -1 && ($scope.references.splice(a, 1), $scope.showReferenceTable = !1, $timeout(function () {
                $scope.$apply(), $scope.showReferenceTable = !0
            }, 100))
        }
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
                $scope.showMeetingTable = !1, $.each($scope.meetings, function (o, s) {
                    void 0 != $scope.meetings[o].id && $scope.meetings[o].id === t.id && (a = !0)
                }), a ? Notification.error("The meeting you have entered already exist") : ($scope.meetings.splice(0, 0, t), $timeout(function () {
                    $scope.$apply(), $scope.showMeetingTable = !0
                }, 100))
            })
        };
        $scope.editMeetings = function (t, a) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddMeetingModalCtrl",
                templateUrl: "app/pages/tours/meetingModal.html",
                resolve: {
                    meetingInfo: function () {
                        return t
                    },
                    isEdit: function () {
                        return !1
                    }
                }
            }).result.then(function (t) {
                var o = !1;
                $scope.showMeetingTable = !1, $.each($scope.meetings, function (s, i) {
                    void 0 != $scope.meetings[s].id && $scope.meetings[s].id === t.id && a != s && (o = !0)
                }), o ? (Notification.error("The meeting you have entered already exist."), $timeout(function () {
                    $scope.$apply(), $scope.showMeetingTable = !0
                }, 100)) : ($scope.meetings[a] = t, $timeout(function () {
                    $scope.$apply(), $scope.showMeetingTable = !0
                }, 100))
            })
        };
        $scope.removeMeetings = function (t) {
            var a = $scope.meetings.indexOf(t);
            a !== -1 && ($scope.meetings.splice(a, 1), $scope.showMeetingTable = !1, $timeout(function () {
                $scope.$apply(), $scope.showMeetingTable = !0
            }, 100))
        }



        // ********************************************************************* //
        $scope.addVisitor = function (t) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddVisitorModalCtrl",
                templateUrl: "app/pages/tours/visitorModal.html",
                resolve: {
                    organizationName: function () {
                        return $scope.formscope.organization
                    },
                    organizationNameData: function () {
                        return $scope.organizationOption
                    },
                    visitorInfo: function () {
                        return {}
                    },
                    isEdit: function () {
                        return !0
                    }
                }
            }).result.then(function (t) {
                var a = !1;
                $scope.showTable = !1;
                $.each($scope.visitors, function (o, s) {
                    void 0 != $scope.visitors[o].id && $scope.visitors[o].id === t.id && (a = !0)
                });
                if (a) {
                    Notification.error("The visitor you have entered already exist");
                    $timeout(function () {
                        $scope.$apply(), $scope.showTable = !0
                    }, 100);
                } else {
                    if (!$scope.visitors || ($scope.visitors && $scope.visitors.length == 0)) {
                        $scope.formscope.contact_manager = t.email;
                    }
                    $scope.visitors.splice(0, 0, t), $timeout(function () {
                        $scope.$apply(), $scope.showTable = !0
                    }, 100);
                }
            })
        };
        $scope.editVisitor = function (t, a) {
            $uibModal.open({
                animation: !0,
                size: "lg",
                controller: "AddVisitorModalCtrl",
                templateUrl: "app/pages/tours/visitorModal.html",
                resolve: {
                    organizationName: function () {
                        return $scope.formscope.organization
                    },
                    organizationNameData: function () {
                        return $scope.organizationOption
                    },
                    visitorInfo: function () {
                        return t
                    },
                    isEdit: function () {
                        return !0
                    }
                }
            }).result.then(function (t) {
                var o = !1;
                $scope.showTable = !1, $.each($scope.visitors, function (s, i) {
                    void 0 != $scope.visitors[s].id && $scope.visitors[s].id === t.id && a != s && (o = !0)
                }), o ? (Notification.error("The visitor you have entered already exist."), $timeout(function () {
                    $scope.$apply(), $scope.showTable = !0
                }, 100)) : ($scope.visitors[a] = t, $timeout(function () {
                    $scope.$apply(), $scope.showTable = !0
                }, 100))
            })
        };
        $scope.removeVisitor = function (t) {
            var a = $scope.visitors.indexOf(t),
                o = $scope.visitors[a].id;
            if (o) {
                var s = {
                    tour_id: $scope.urlID,
                    visitor_id: o
                };
                ToursFactory.deleteVisitor(s).success(function (t) {
                    $scope.visitorsOption = t.data
                }).error(function (e) { })
            }
            a !== -1 && ($scope.visitors.splice(a, 1), $scope.showTable = !1, $timeout(function () {
                $scope.$apply(), $scope.showTable = !0
            }, 100))
        };
        $scope.addMeals = function (t) {
            $uibModal.open({
                animation: !0,
                backdrop: "static",
                controller: "AddMealModalCtrl",
                templateUrl: "app/pages/tours/mealModal.html",
                resolve: {
                    meals: function () {
                        return $scope.mealsTypeOption
                    },
                    selectedMeals: function () {
                        return $scope.selectedMeals
                    },
                    mealData: function () {
                        return t
                    }
                }
            }).result.then(function (t) {
                $scope.formscope.meals = 1;
                $scope.mealsType.push(t), $.each($scope.mealsTypeOption, function (a, o) {
                    void 0 != $scope.mealsTypeOption[a].id && $scope.mealsTypeOption[a].id === t.meal_id && $scope.selectedMeals.push(t.meal_id)
                }), Notification.success("Meal added successfully.")
            })
        };
        $scope.editMeals = function (t, a) {
            $uibModal.open({
                animation: !0,
                backdrop: "static",
                controller: "AddMealModalCtrl",
                templateUrl: "app/pages/tours/mealModal.html",
                resolve: {
                    meals: function () {
                        return $scope.mealsTypeOption
                    },
                    selectedMeals: function () {
                        return $scope.selectedMeals
                    },
                    mealData: function () {
                        return t
                    }
                }
            }).result.then(function (t) {
                if ($scope.mealsType[a] = t, t.meal_id !== t.old_meal_id) {
                    var o = [];
                    $.each($scope.selectedMeals, function (e, q) {
                        $.inArray(q, o) === -1 && o.push(q)
                    });
                    $scope.selectedMeals = o;
                    var s = $scope.selectedMeals.indexOf(t.old_meal_id);
                    $scope.selectedMeals.splice(s, 1)
                }
                $.each($scope.mealsTypeOption, function (a, o) {
                    void 0 != $scope.mealsTypeOption[a].id && $scope.mealsTypeOption[a].id === t.meal_id && $scope.selectedMeals.push(t.meal_id)
                }), Notification.success("Meal updated successfully.")
            })
        };
        $scope.removeMeal = function (t) {
            var a = [];
            $.each($scope.selectedMeals, function (e, t) {
                $.inArray(t, a) === -1 && a.push(t)
            });
            $scope.selectedMeals = a;
            var o = $scope.selectedMeals.indexOf($scope.mealsType[t].meal_id);
            $scope.selectedMeals.splice(o, 1), $scope.mealsType.splice(t, 1), Notification.success("Meal deleted successfully.")
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
        $scope.docList = [];
        $scope.notes = [];
        ToursFactory.getRecord($scope.urlID).success(function (t) {
            $timeout(function () {
                $scope.formscope = t.data,
                    $scope.formscope.language = t.data.language,
                    $scope.formscope.meals = 1 == t.data.meals,
                    $scope.activeTask = t.data.tour_tasks,
                    $scope.docList = $scope.formscope.tour_documents,
                    $scope.notes = $scope.formscope.tour_notes,
                    null == $scope.formscope.tourtype_id && ($scope.edittourtype = !0),
                    $.each($scope.notes, function (t, a) {
                        $scope.notes[t].name = $scope.notes[t].tour_notes_created.name
                    }),
                    $.each($scope.docList, function (t, a) {
                        $scope.docList[t].name = $scope.docList[t].tour_docs_created.name
                    });
                $scope.documentDataFlag = !0, $scope.showTable = !0,
                    $.each(t.data.tour_visitors_edit, function (a, o) {
                        1 == t.data.tour_visitors_edit[a].is_tour_admin && (t.data.contact_manager = t.data.tour_visitors_edit[a].visitor.email),
                            $scope.visitors.push(t.data.tour_visitors_edit[a].visitor);
                    }),
                    $.each(t.data.tour_refference_edit, function (a, o) {
                        1 == t.data.tour_refference_edit[a].is_tour_admin && (t.data.reference = t.data.tour_refference_edit[a].refference.email),
                            $scope.references.push(t.data.tour_refference_edit[a].refference)
                    }),
                    $.each(t.data.tour_meeting_edit, function (a, o) {
                        1 == t.data.tour_meeting_edit[a].is_tour_admin && (t.data.meeting = t.data.tour_meeting_edit[a].meeting.email),
                            $scope.meetings.push(t.data.tour_meeting_edit[a].meeting)
                    }),
                    $.each(t.data.tour_meals, function (a, o) {
                        $scope.selectedMeals.push(t.data.tour_meals[a].meal_id);
                        var mealType = $scope.mealsTypeOption.filter(function (mealObj) {
                            return mealObj.id === t.data.tour_meals[a].meal_id
                        });
                        if (mealType.length > 0)
                            t.data.tour_meals[a].meal_txt = mealType[0].name;
                        var mealServiceTypeOption = $scope.mealServiceTypeOption.filter(function (mealServiceTypeObj) {
                            return mealServiceTypeObj.id === t.data.tour_meals[a].meal_service_type_id
                        });
                        if (mealServiceTypeOption.length > 0)
                            t.data.tour_meals[a].mealservice_txt = mealServiceTypeOption[0].name;
                        var mealServiceLocationsOption = $scope.mealServiceLocationsOption.filter(function (mealServiceLocationsObj) {
                            return mealServiceLocationsObj.id === t.data.tour_meals[a].meal_service_location_id
                        });
                        if (mealServiceLocationsOption.length > 0)
                            t.data.tour_meals[a].meallocation_txt = mealServiceLocationsOption[0].name;
                        var usersOption = $scope.usersOption.filter(function (usersOptionObj) {
                            return usersOptionObj.id === t.data.tour_meals[a].catering_manager
                        });
                        if (usersOption.length > 0)
                            t.data.tour_meals[a].catering_manager_txt = usersOption[0].name;
                    });
                $scope.mealsType = t.data.tour_meals;
            }, 100)
        }).error(function (e) {
            Notification.error(e.error), $state.go("tours.list")
        });
        $scope.add_data = function (t) {
            $scope.isSubmitted = !0, z.validate(t).success(function () {
                return $scope.formscope.visitors = $scope.visitors, $scope.formscope.references = $scope.references, $scope.formscope.meetings = $scope.meetings, $scope.formscope.mealsType = $scope.mealsType, $scope.formscope.tasks = $scope.activeTaskList, $scope.formscope.documents = $scope.docList, $scope.formscope.notes = $scope.notes,
                    ((!$scope.formscope.senior || $scope.formscope.senior < 1) && (!$scope.formscope.adults || $scope.formscope.adults < 1)) ? void Notification.error("Adults or Senior count must be more than one!") :
                        // $scope.formscope.meals && 0 == $scope.mealsType.length ? (Notification.error("Please add meals first."),void(e.isSubmitted = !1)) :
                        ($scope.formscope._method = "PUT", void ToursFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
                            Notification.success(t.success), $state.go("tours.list"), $scope.isSubmitted = !1
                        }).error(function (t) {
                            Notification.error(t.error), $scope.isSubmitted = !1
                        }))
            }).error(function (t) {
                $scope.isSubmitted = !1;
            });
        };
        $scope.addDocument = function (t) {
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
                }), a ? Notification.error("The document title you have entered already exist") : o ? Notification.error("The document link you have entered already exist") : ToursFactory.tourDocument(t).success(function (a) {
                    Notification.success(a.success), a.data.name = t.name, $scope.docList.splice(0, 0, a.data)
                }).error(function (e) {
                    Notification.error(e.error)
                })
            })
        };
        $scope.editDocument = function (t, a) {
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
                o.tour_id = $scope.urlID, o.id = t.id, o.created_by = $scope.loginID;
                var s = !1,
                    i = !1;
                $.each($scope.docList, function (t, r) {
                    $scope.docList[t].title.toLowerCase() === o.title.toLowerCase() && a != t ? s = !0 : $scope.docList[t].link === o.link && a != t && (i = !0)
                }), s ? Notification.error("The document title you have entered already exist") : i ? Notification.error("The document link you have entered already exist") : ToursFactory.tourDocument(o).success(function (o) {
                    Notification.success(o.success), $scope.docList[a] = o.data, $scope.docList[a].name = t.name
                }).error(function (e) {
                    Notification.error(e.error)
                })
            })
        };
        $scope.removeDoc = function (t) {
            var a = {
                id: $scope.docList[t].id
            };
            ToursFactory.deleteDocument(a).success(function (a) {
                Notification.success(a.success), $scope.docList.splice(t, 1)
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.addNote = function (t) {
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
                t.tour_id = $scope.urlID, ToursFactory.tourNote(t).success(function (a) {
                    Notification.success(a.success), a.data.name = t.name, $scope.notes.splice(0, 0, a.data)
                }).error(function (e) {
                    Notification.error(e.error)
                })
            })
        };
        $scope.editNote = function (t, a) {
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
                $scope.showTable = !1, o.tour_id = $scope.urlID, o.id = t.id, ToursFactory.tourNote(o).success(function (o) {
                    Notification.success(o.success), $scope.notes[a] = o.data, $scope.notes[a].name = t.name
                }).error(function (e) {
                    Notification.error(e.error)
                })
            })
        };
        $scope.removeNotes = function (t) {
            var a = {
                id: $scope.notes[t].id
            };
            ToursFactory.deleteNote(a).success(function (a) {
                Notification.success(a.success), $scope.notes.splice(t, 1)
            }).error(function (e) {
                Notification.error(e.error)
            })
        };
        $scope.documentOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];
        $scope.notesOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.notesColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];
        $scope.visitorOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers");
        $scope.visitorColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7)
        ]
    }
})();
