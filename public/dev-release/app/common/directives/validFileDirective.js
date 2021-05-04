App.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {

            ngModel.$render = function () {
                if (el[0].files && el[0].files.length) {
                    ngModel.$setViewValue(el[0].files[0]);
                    //scope.upload();
                }
            };

            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$render();
                });
            });

        }
    }
});


App.directive('validPdf', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            var validFormats = ['pdf'];
            elem.bind('change', function () {
                validImage(false);
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
            ngModel.$render = function () {
                ngModel.$setViewValue(elem.val());
            };
            function validImage(bool) {
                ngModel.$setValidity('extension', bool);
            }
            ngModel.$parsers.push(function(value) {
                var ext = value.substr(value.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validImage(true);
                return value;
            });
        }
    }
});

/*App.directive('pdfFile', function () {
return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModel) {
        var validFormats = ['pdf'];
        elem.bind('change', function () {
            validImage(false);
            scope.$apply(function () {
                ngModel.$render();
            });
        });
        ngModel.$render = function () {
            ngModel.$setViewValue(elem.val());
        };
        function validImage(bool) {
            ngModel.$setValidity('extension', bool);
        }
        ngModel.$parsers.push(function(value) {
            var ext = value.substr(value.lastIndexOf('.')+1);
            if(ext=='') return;
            if(validFormats.indexOf(ext) == -1){
                return value;
            }
            validImage(true);
            console.log(value);
            return value;
        });
    }
  };
});*/

App.directive('pdfFile', function validFile() {
    var validFormats = ['pdf'];
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$validators.validFile = function() {
                elem.on('change', function () {
                   var value = elem.val(),
                       ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
                   if(validFormats.indexOf(ext) !== -1) {
                       return true;
                   }
                   else {
                       return false;
                   }
                });
           };
        }
    };
});