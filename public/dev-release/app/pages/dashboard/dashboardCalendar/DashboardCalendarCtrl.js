/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardCalendarCtrl', DashboardCalendarCtrl);

    /** @ngInject */
    function DashboardCalendarCtrl(baConfig, $timeout, $rootScope, $filter, $stateParams, $state, UsersFactory, DashboardsFactory) {
        var dashboardColors = baConfig.colors.dashboard;

        /** 
         * Get calendar data
         */
        var calendarData = [];
        DashboardsFactory.getCalenderRecord().success(function(response) {
            $.each(response.data, function(i, el) {
                var data = {
                    title: response.data[i].name,
                    id: response.data[i].id,
                    start: response.data[i].start_date,
                    end: response.data[i].start_date,
                    color: dashboardColors.blueStone
                };
                calendarData.push(data);
            });
        }).error(function(error) {

        });
        /* End calendar data */

        $timeout(function() {
            var $element = $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month, agendaWeek, agendaDay'
                },
                defaultDate: new Date(),
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    var addPermition = $rootScope.havePermission('tours', 'create');
                    if (addPermition) {
                        if (confirm("Are you sure want to add a tour?")) {
                            var sDate = moment(start._d).format('DDMMYYYYHHmmss');
                            $state.go('tours.add', {date:sDate});
                        }
                    }
                },
                timeFormat: 'h(:mm)a',
                editable: true,
                eventLimit: true,
                events: calendarData,
                eventClick: function(event) {
                    if (event.id) {
                        $state.go('tours.viewdetails',{id: event.id});
                    }
                }
            });
        }, 1500);
    }
})();