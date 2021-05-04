/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardCalendarCtrl', DashboardCalendarCtrl);

    /** @ngInject */
    function DashboardCalendarCtrl(baConfig, $timeout, $rootScope, $filter, $stateParams, $state, UsersFactory, DashboardsFactory) {
        var l = baConfig.colors.dashboard,
            c = [];
        DashboardsFactory.getCalenderRecord().success(function (e) {
            $.each(e.data, function (t, a) {
                var o = {
                    title: e.data[t].name,
                    id: e.data[t].id,
                    start: e.data[t].start_date,
                    end: e.data[t].start_date,
                    color: l.blueStone
                };
                c.push(o)
            })
        }).error(function (e) {}), $timeout(function () {
            $("#calendar").fullCalendar({
                header: {
                    left: "today , prev,next",
                    center: "title",
                    right: "month, agendaWeek, agendaDay"
                },
                defaultDate: new Date,
                selectable: !0,
                selectHelper: !0,
                select: function (e, t) {
                    var o = $rootScope.havePermission("tours", "create");
                    if (o && confirm("Are you sure want to add a tour?")) {
                        var s = moment(e._d).format("DDMMYYYYHHmmss");
                        $state.go("tours.add", {
                            date: s
                        })
                    }
                },
                timeFormat: "h(:mm)a",
                editable: !0,
                eventLimit: !0,
                events: c,
                eventClick: function (e) {
                    e.id && $state.go("tours.viewdetails", {
                        id: e.id
                    })
                }
            })
        }, 1500)
    }
})();