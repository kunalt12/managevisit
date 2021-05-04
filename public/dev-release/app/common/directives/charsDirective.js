/*********************************************************
    - Author: Sebastian Cubillos
    - Github: @tianes
    - More Gists: https://gist.github.com/tianes/
    - Contact: sebastian@cubillos.org
    - Article: https://goo.gl/oOzNXU
**********************************************************/

App.directive('chars', function () {
    /* RegEx Examples:
        - email: "0-9a-zA-Z@._\-"
        - numbers only: "0-9"
        - letters only: "a-zA-Z"
        Email Usage Example:
        <input type="text" name="email" ng-model="user.email" chars="0-9a-zA-Z@._\-" />
    */
    'use strict';
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function ($scope, $elem, attrs, ctrl) {
            var regReplace,
                preset = {
                    'slug': 'a-z0-9._-',
                    'text': 'A-Z a-z\')(.,- 0-9',
                    'company-name': 'A-Z a-z.,- 0-9',
                    'only-numbers': '0-9.',
                    'numbers': '0-9',
                    'only-letters': 'A-Za-z',
                    'only-letters-space': 'A-Z a-z',
                    'letters': 'a-z 0-9._-', /*'letters': 'A-Za-z\\s',*/
                    'email': '\\wÑñ@._\\-',
                    'alpha-numeric': '\\w\\s',
                    'latin-alpha-numeric': '\\w\\sÑñáéíóúüÁÉÍÓÚÜ'
                },
                filter = preset[attrs.chars] || attrs.chars;

            $elem.on('input', function () {
                regReplace = new RegExp('[^' + filter + ']', 'ig');
                ctrl.$setViewValue($elem.val().replace(regReplace, ''));
                ctrl.$render();
            });
        }
    };
});