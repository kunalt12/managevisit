App.directive('myYear', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="city.value as city.text for city in range2"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.range2 = [{ value: null, text: "Select year" }];

                var year = new Date().getFullYear();
                $scope.range2.push(year);
                for (var i = 0; i < 30; i++) {
                    var yearName = Number(year) + Number(i);
                    var yearData = {
                        value: yearName,
                        text: yearName
                    };
                    $scope.range2.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.range2 = [{ value: null, text: "Select year" }];
        }
    };
}]);

App.directive('myMonth', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="month.value as month.text for month in months2"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.months2 = [
                    { value: null, text: "Select month" },
                    { value: 1, text: '1 - Jan' },
                    { value: 2, text: '2 - Feb' },
                    { value: 3, text: '3 - Mar' },
                    { value: 4, text: '4 - Apr' },
                    { value: 5, text: '5 - May' },
                    { value: 6, text: '6 - Jun' },
                    { value: 7, text: '7 - Jul' },
                    { value: 8, text: '8 - Aug' },
                    { value: 9, text: '9 - Sep' },
                    { value: 10, text: '10 - Oct' },
                    { value: 11, text: '11 - Nov' },
                    { value: 12, text: '12 - Dec' }
                ];

                // for(var i=1;i<12;i++) {
                //     var yearData = {
                //         value: i, text: i
                //     };
                //     $scope.months2.push(yearData);
                // }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.months2 = [{ value: null, text: "Select month" }];
        }
    };
}]);

App.directive('issueYear', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="city.value as city.text for city in range"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.range = [{ value: null, text: "Year" }];

                var year = new Date().getFullYear();
                $scope.range.push(year);
                for (var i = -40; i <= 0; i++) {
                    var yearName = Number(year) + Number(i);
                    var yearData = {
                        value: yearName,
                        text: yearName
                    };
                    $scope.range.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.range = [{ value: null, text: "Year" }];
        }
    };
}]);

App.directive('issueMonth', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="month.value as month.text disable when month.disabled for month in months"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch("transaction.sender.id_proof_issue_year", function(newValue, oldValue) {
                $scope.mnthName = ['1 - Jan', '2 - Feb', '3 - Mar', '4 - Apr', '5 - May', '6 - Jun', '7 - Jul', '8 - Aug', '9 - Sep', '10 - Oct', '11 - Nov', '12 - Dec']
                $scope.months = [{ value: null, text: "Month" }];

                var year = new Date().getFullYear();
                var month = Number(new Date().getMonth()) + Number(1);

                for (var i = 0; i < 12; i++) {
                    var disableData = false;
                    if (year == $scope.transaction.sender.id_proof_issue_year) {
                        if (i >= month) {
                            disableData = true;
                        }
                    }

                    var yearData = { value: Number(i) + Number(1), text: $scope.mnthName[i], disabled: disableData };
                    $scope.months.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.months = [{ value: null, text: "Month" }];
        }
    };
}]);

App.directive('expireYear', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="city.value as city.text for city in range1"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.range1 = [{ value: null, text: "Year" }];

                var year = new Date().getFullYear();
                $scope.range1.push(year);
                for (var i = 0; i < 40; i++) {
                    var yearName = Number(year) + Number(i);
                    var yearData = {
                        value: yearName,
                        text: yearName
                    };
                    $scope.range1.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.range1 = [{ value: null, text: "Year" }];
        }
    };
}]);

App.directive('expireMonth', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="month.value as month.text disable when month.disabled for month in months1"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            if ($scope.transaction) {
                $scope.$watch("transaction.sender.id_proof_expire_year", function(newValue, oldValue) {
                    $scope.mnthName = ['1 - Jan', '2 - Feb', '3 - Mar', '4 - Apr', '5 - May', '6 - Jun', '7 - Jul', '8 - Aug', '9 - Sep', '10 - Oct', '11 - Nov', '12 - Dec']
                    $scope.months1 = [{ value: null, text: "Month" }];

                    var year = new Date().getFullYear();
                    var month = new Date().getMonth();

                    for (var i = 0; i < 12; i++) {
                        var disableData = false;
                        if (year == $scope.transaction.sender.id_proof_expire_year) {
                            if (i < month) {
                                disableData = true;
                            }
                        }

                        var yearData = { value: Number(i) + Number(1), text: $scope.mnthName[i], disabled: disableData };
                        $scope.months1.push(yearData);
                    }
                });
            }
            if ($scope.user) {
                $scope.$watch("user.id_proof_expire_year", function(newValue, oldValue) {
                    $scope.mnthName = ['1 - Jan', '2 - Feb', '3 - Mar', '4 - Apr', '5 - May', '6 - Jun', '7 - Jul', '8 - Aug', '9 - Sep', '10 - Oct', '11 - Nov', '12 - Dec']
                    $scope.months1 = [{ value: null, text: "Month" }];

                    var year = new Date().getFullYear();
                    var month = new Date().getMonth();

                    for (var i = 0; i < 12; i++) {
                        var disableData = false;
                        if (year == $scope.user.id_proof_expire_year) {
                            if (i < month) {
                                disableData = true;
                            }
                        }

                        var yearData = { value: Number(i) + Number(1), text: $scope.mnthName[i], disabled: disableData };
                        $scope.months1.push(yearData);
                    }
                });
            }
        },
        link: function(scope, iElement, iAttrs) {
            scope.months1 = [{ value: null, text: "Month" }];
        }
    };
}]);

App.directive('reportYear', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="city.value as city.text for city in range"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.range = [{ value: null, text: "Year" }];

                var year = new Date().getFullYear();
                $scope.range.push(year);
                for (var i = 0; i <= 30; i++) {
                    var yearName = Number(year) - Number(i);
                    var yearData = {
                        value: yearName,
                        text: yearName
                    };
                    $scope.range.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.range = [{ value: null, text: "Year" }];
        }
    };
}]);

App.directive('reportMonth', ['$http', '$config', function($http, $config) {
    return {
        restrict: 'E',
        template: '<select inherit-select-classes="true" chosen ng-selected="true" ng-options="month.value as month.text for month in months"></select>',
        replace: true,
        controller: function($scope, $element, $attrs, $transclude, $http) {
            $scope.$watch($scope.stateNgModel, function(newValue, oldValue) {
                $scope.mnthName = ['1 - Jan', '2 - Feb', '3 - Mar', '4 - Apr', '5 - May', '6 - Jun', '7 - Jul', '8 - Aug', '9 - Sep', '10 - Oct', '11 - Nov', '12 - Dec']
                $scope.months = [{ value: null, text: "Month" }];
                var year = new Date().getFullYear();
                var month = Number(new Date().getMonth()) + Number(1);

                for (var i = 0; i < 12; i++) {
                    var yearData = { value: Number(i) + Number(1), text: $scope.mnthName[i] };
                    $scope.months.push(yearData);
                }
            });
        },
        link: function(scope, iElement, iAttrs) {
            scope.months = [{ value: null, text: "Month" }];
        }
    };
}]);

App.directive('modal', function() {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">Help Text</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});