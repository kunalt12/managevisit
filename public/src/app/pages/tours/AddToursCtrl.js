/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddToursCtrl', AddToursCtrl);

    /** @ngInject */
    function AddToursCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, VisitorsFactory, ToursFactory, UsersFactory, MealservicetypesFactory, MealservicelocationsFactory, LocationsFactory, MealsFactory, OrganizationsFactory, DefaulttasksFactory, TourtypesFactory, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, MomentosFactory, AffiliationsFactory) {
        if ($scope.sDate = $stateParams.date, $stateParams.date) {
            var S = moment($stateParams.date, "DDMMYYYYHHmmss").format("YYYY-MM-DD HH:mm:ss");
        } else {
            var S = null;
        }
        $scope.pageName = "Add Tour";
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.formscope = {
                tourtype_id: null,
                transport_id: null,
                affiliate: null,
                location_id: null,
                language: 'english',
                meals: 1,
                manager: null,
                status: 0,
                contact_manager: null,
                organization: "",
                start_date: S,
                momento_type: null,
                momento_quantity: null
            },
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
        $scope.showTable = !0;
        $scope.smartTablePageSize = 5;
        $scope.loginProgress = !1;
        $scope.loginID = $rootScope.auth_user.id;
        $scope.edittourtype = !1;
        $scope.organizationOption = [], ToursFactory.getOrganization().success(function (t) {
            $scope.organizationOption = $scope.organizationOption.concat(t.data)
        }).error(function (e) {});
        $scope.residentSelected = function (t) {
            t && (t.originalObject.organization ? $scope.formscope.organization = t.originalObject.organization : $scope.formscope.organization = t.originalObject)
        };
        $scope.smartTablePageSize = 10;
        $scope.activeTaskList = [];
        $scope.addTaskBtn = !1;
        $scope.minDateMoment = moment().subtract("day");
        $scope.visitors = [];
        $scope.references = [];
        $scope.meetings = [];
        $scope.mealsType = [];
        $scope.selectedMeals = [];
        $scope.statusOption = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        $scope.TransportOption = [{
            name: "Please select transport type",
            id: null
        }], TransportsFactory.getRecords().success(function (t) {
            $scope.TransportOption = $scope.TransportOption.concat(t.data)
        }).error(function (e) {});
        $scope.TourTypeOption = [{
            name: "Please select tour type",
            id: null
        }], TourtypesFactory.getRecords().success(function (t) {
            $scope.TourTypeOption = $scope.TourTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.OrganizationTypeOption = [{
            name: "Please select organization type",
            id: null
        }], OrganizationsFactory.getRecords().success(function (t) {
            $scope.OrganizationTypeOption = $scope.OrganizationTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealsTypeOption = [{
            name: "Please select meal type",
            id: null
        }], MealsFactory.getRecords().success(function (t) {
            $scope.mealsTypeOption = $scope.mealsTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.locationsTypeOption = [{
            name: "Please select location",
            id: null
        }], LocationsFactory.getRecords().success(function (t) {
            $scope.locationsTypeOption = $scope.locationsTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealServiceTypeOption = [{
            name: "Please select meal service type",
            id: null
        }], MealservicetypesFactory.getRecords().success(function (t) {
            $scope.mealServiceTypeOption = $scope.mealServiceTypeOption.concat(t.data)
        }).error(function (e) {});
        $scope.mealServiceLocationsOption = [{
            name: "Please select meal service location",
            id: null
        }], MealservicelocationsFactory.getRecords().success(function (t) {
            $scope.mealServiceLocationsOption = $scope.mealServiceLocationsOption.concat(t.data)
        }).error(function (e) {});
        $scope.managersOption = [{
            name: "Please select tour manager",
            id: null
        }];
        $scope.tourMomentoOptions = [{
            name: "Please select a momento",
            id: null
        }], MomentosFactory.getRecords().success(function (t) {
            $scope.tourMomentoOptions = $scope.tourMomentoOptions.concat(t.data);
        }).error(function (e) {});
        UsersFactory.getTourManager().success(function (t) {
            $scope.managersOption = $scope.managersOption.concat(t.data), $.each($scope.managersOption, function (t, a) {
                void 0 != $scope.managersOption[t].id && 1 == $scope.managersOption[t].availability && ($scope.managersOption[t].isDisabled = !0)
            })
        }).error(function (e) {});
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }], VisitorsFactory.getRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data)
        }).error(function (e) {});
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
                }).error(function (e) {}), $scope.addTaskBtn = !0) : ($scope.addTaskBtn = !1, $scope.activeTaskList = [])
            }), $scope.unconnect = function (t) {
                $scope.activeTaskList.splice(t, 1)
            }, $scope.connect = function (t) {
                $scope.activeTaskList[t].status = 1
            }, $scope.showModal = function (t) {
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
            }, $scope.addReferences = function (t) {
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
                    console.log("Previous References : ", $scope.references);
                    console.log("References added : ", t);
                    var a = !1;
                    $scope.showReferenceTable = !1, $.each($scope.references, function (o, s) {
                        void 0 != $scope.references[o].id && $scope.references[o].id === t.id && (a = !0)
                    }), a ? Notification.error("The reference you have entered already exist") : ($scope.references.splice(0, 0, t), $timeout(function () {
                        $scope.$apply(), $scope.showReferenceTable = !0
                    }, 100))
                })
            },
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
            }, $scope.removeReference = function (t) {
                var a = $scope.references.indexOf(t);
                a !== -1 && ($scope.references.splice(a, 1), $scope.showReferenceTable = !1, $timeout(function () {
                    $scope.$apply(), $scope.showReferenceTable = !0, console.log("e.references : ", $scope.references);
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
                    console.log("Previous meetings : ", $scope.meetings);
                    console.log("meetings added : ", t);
                    var a = !1;
                    $scope.showMeetingTable = !1, $.each($scope.meetings, function (o, s) {
                        void 0 != $scope.meetings[o].id && $scope.meetings[o].id === t.id && (a = !0)
                    }), a ? Notification.error("The meeting you have entered already exist") : ($scope.meetings.splice(0, 0, t), $timeout(function () {
                        $scope.$apply(), $scope.showMeetingTable = !0
                    }, 100))
                })
            },
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
            }, $scope.removeMeetings = function (t) {
                var a = $scope.meetings.indexOf(t);
                a !== -1 && ($scope.meetings.splice(a, 1), $scope.showMeetingTable = !1, $timeout(function () {
                    $scope.$apply(), $scope.showMeetingTable = !0, console.log("e.meetings : ", $scope.meetings);
                }, 100))
            }, $scope.addVisitor = function (t) {
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
                            return !1
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
                    } else {
                        if (!$scope.visitors || ($scope.visitors && $scope.visitors.length == 0)) {
                            $scope.formscope.contact_manager = t.email;
                        }
                        $scope.visitors.splice(0, 0, t);
                        $timeout(function () {
                            $scope.$apply();
                            $scope.showTable = !0;
                        }, 100);
                    }
                })
            }, $scope.editVisitor = function (t, a) {
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
                            return !1
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
            }, $scope.removeVisitor = function (t) {
                var a = $scope.visitors.indexOf(t);
                a !== -1 && ($scope.visitors.splice(a, 1), $scope.showTable = !1, $timeout(function () {
                    $scope.$apply(), $scope.showTable = !0
                }, 100))
            }, $scope.addMeals = function (t) {
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
                    $scope.mealsType.push(t), $.each($scope.mealsTypeOption, function (a, o) {
                        void 0 != $scope.mealsTypeOption[a].id && $scope.mealsTypeOption[a].id === t.meal_id && $scope.selectedMeals.push(t.meal_id)
                    }), Notification.success("Meal added successfully.")
                })
            }, $scope.editMeals = function (t, a) {
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
                        $.each($scope.selectedMeals, function (e, t) {
                            $.inArray(t, o) === -1 && o.push(t)
                        }), $scope.selectedMeals = o;
                        var s = $scope.selectedMeals.indexOf(t.old_meal_id);
                        $scope.selectedMeals.splice(s, 1)
                    }
                    $.each($scope.mealsTypeOption, function (a, o) {
                        void 0 != $scope.mealsTypeOption[a].id && $scope.mealsTypeOption[a].id === t.meal_id && $scope.selectedMeals.push(t.meal_id)
                    }), Notification.success("Meal updated successfully.")
                })
            }, $scope.removeMeal = function (t) {
                var a = [];
                $.each($scope.selectedMeals, function (e, t) {
                    $.inArray(t, a) === -1 && a.push(t)
                }), $scope.selectedMeals = a;
                var o = $scope.selectedMeals.indexOf($scope.mealsType[t].meal_id);
                $scope.selectedMeals.splice(o, 1), $scope.mealsType.splice(t, 1), Notification.success("Meal deleted successfully.")
            };
        var P = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation, P.setExpression({
                organization: function (e, t, a, o) {
                    return "" != e || null != e || "null" != e
                }
            }).setDefaultMsg({
                organization: {
                    error: ToursFactory.validation.organization.required
                }
            }), $scope.mailModal = function (t) {
                P.validate(t).success(function () {
                    return $scope.formscope.visitors = $scope.visitors, $scope.formscope.references = $scope.references, $scope.formscope.meetings = $scope.meetings, $scope.formscope.mealsType = $scope.mealsType,
                        ((!$scope.formscope.senior || $scope.formscope.senior < 1) && (!$scope.formscope.adults || $scope.formscope.adults < 1)) ? void Notification.error("Adults or Senior count must be more than one!") :
                        // $scope.formscope.meals && 0 == $scope.mealsType.length ? void Notification.error("Please add meals first.") :
                        ($scope.formscope.contact_manager) ? void $uibModal.open({
                            animation: !0,
                            backdrop: "static",
                            controller: "TourMailModalCtrl",
                            templateUrl: "app/pages/tours/mailModal.html",
                            resolve: {
                                tourStatus: function () {
                                    return 0
                                }
                            }
                        }).result.then(function (t) {
                            $scope.add_data(t)
                        }) : void(0 == $scope.formscope.visitors.length ? Notification.error("Please add visitors first.") : Notification.error("Please select contact manager."))
                }).error(function () {
                    $scope.isSubmitted = !1
                })
            }, $scope.changePreferredLanguage = function (s) {
                console.log("Language selected : ", s, $scope.formscope);
            }, $scope.getDate = function (d) {
                return new Date(d).toString("MMMM yyyy");
            }, $scope.add_data = function (t) {
                $scope.loginProgress = !0,
                    $scope.isSubmitted = !0,
                    $scope.formscope.visitors = $scope.visitors,
                    $scope.formscope.references = $scope.references,
                    $scope.formscope.meetings = $scope.meetings,
                    $scope.formscope.mealsType = $scope.mealsType,
                    $scope.formscope.tasks = $scope.activeTaskList,
                    $scope.formscope.sendMail = t.sendMail,
                    $scope.formscope.mailSubject = t.mailSubject,
                    $scope.formscope.mailContent = t.mailContent,
                    $scope.formscope.status = t.status,
                    $scope.formscope.documents = $scope.docList,
                    $scope.formscope.notes = $scope.notes, ToursFactory.addRecord($scope.formscope).success(function (t) {
                        Notification.success(t.success), $state.go("tours.list"), $scope.isSubmitted = !1
                    }).error(function (t) {
                        $scope.loginProgress = !1, Notification.error(t.error), $scope.isSubmitted = !1
                    })
            }, $scope.docList = [], $scope.addDocument = function (t) {
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
                    t.created_by = $scope.loginID;
                    var a = !1,
                        o = !1;
                    $.each($scope.docList, function (s, i) {
                        $scope.docList[s].title.toLowerCase() === t.title.toLowerCase() ? a = !0 : $scope.docList[s].link === t.link && (o = !0)
                    }), a ? Notification.error("The document title you have entered already exist") : o ? Notification.error("The document link you have entered already exist") : ($scope.docList.splice(0, 0, t), $timeout(function () {
                        $scope.$apply(), $scope.showTable = !0
                    }, 100))
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
                }).result.then(function (t) {
                    t.created_by = $scope.loginID;
                    var o = !1,
                        s = !1;
                    $.each($scope.docList, function (i, r) {
                        $scope.docList[i].title.toLowerCase() === t.title.toLowerCase() && a != i ? o = !0 : $scope.docList[i].link === t.link && a != i && (s = !0)
                    }), o ? Notification.error("The document title you have entered already exist") : s ? Notification.error("The document link you have entered already exist") : $scope.docList[a] = t
                })
            }, $scope.removeDoc = function (t) {
                $scope.docList.splice(t, 1), $timeout(function () {
                    $scope.$apply()
                }, 100)
            }, $scope.notes = [], $scope.addNote = function (t) {
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
                    t.created_by = $scope.loginID, $scope.notes.splice(0, 0, t)
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
                }).result.then(function (t) {
                    $scope.showTable = !1, t.created_by = $scope.loginID, $scope.notes[a] = t, $timeout(function () {
                        $scope.$apply(), $scope.showTable = !0
                    }, 100)
                })
            }, $scope.removeNotes = function (t) {
                $scope.notes.splice(t, 1), $timeout(function () {
                    $scope.$apply()
                }, 100)
            }, $scope.showOrganizationTypeOption = function (t) {
                var o = [];
                return null != t.organization_id && (o = $filter("filter")($scope.OrganizationTypeOption, {
                    id: t.organization_id
                })), o.length ? o[0].name : "-"
            }, $scope.showVisitorOption = function (t) {
                var o = [];
                return null != t.visitor_type && (o = $filter("filter")($scope.VisitorOption, {
                    id: t.visitor_type
                })), o.length ? o[0].name : "-"
            }, $scope.reloadData = function () {
                $scope.dtInstance.rerender()
            }, $scope.createdRow = function (t, a, o) {
                $compile(angular.element(t).contents())($scope)
            }, $scope.documentOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers"),
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3)
            ],
            $scope.notesOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers"),
            $scope.notesColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2)
            ],
            $scope.visitorOptions = DTOptionsBuilder.newOptions().withPaginationType("simple_numbers"),
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