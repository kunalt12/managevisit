/*********************************************************
    - Author: Sebastian Cubillos
    - Github: @tianes
    - More Gists: https://gist.github.com/tianes/
    - Contact: sebastian@cubillos.org
    - Article: https://goo.gl/oOzNXU
**********************************************************/

App.directive('acOutsideClick', ['$http', '$config', '$timeout', '$templateCache', function($http, $config, $timeout, $templateCache) {

    var TEMPLATE_URL = '';

    // Set the default template for this directive
    /*$templateCache.put(TEMPLATE_URL,
        '<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">' +
        '  <input id="{{id}}_value" name="{{inputName}}" tabindex="{{fieldTabindex}}" ng-class="{\'angucomplete-input-not-empty\': notEmpty}" ng-model="searchStr" ng-disabled="disableInput" type="{{inputType}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>' +
        '  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown">' +
        '    <div class="angucomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
        '    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
        '    <div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">' +
        '      <div ng-if="imageField" class="angucomplete-image-holder">' +
        '        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>' +
        '        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>' +
        '      </div>' +
        '      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>' +
        '      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>' +
        '      <div ng-if="matchClass && result.description && result.description != \'\'" class="angucomplete-description" ng-bind-html="result.description"></div>' +
        '      <div ng-if="!matchClass && result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );*/

    /*$templateCache.put(TEMPLATE_URL,
        '<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown{{id}}}">' +
        '{{outerHTML}}' +
        '<div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown{{id}}">  ' +
        '    <div class="angucomplete-searching" ng-show="!searchResult1 || searchResult1.length == 0">{{textNoResults}}</div> ' +
        '    <div class="angucomplete-row" ng-repeat="result in searchResult1" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"> ' +
        '        <div class="angucomplete-title"ng-bind-html="result.name"></div> ' +
        '        <div ng-if="result.mobile && result.mobile != \'\'" class="angucomplete-description" ng-bind-html="result.mobile"></div> ' +
        '    </div> ' +
        '</div>' +
        '</div>'
    );*/

    return {
        restrict: 'EA',
        require: '^?form',
        scope: {
            acOutsideClick: '&',
            initialValue: "@",
            name: '@',
            id: '@',
            placeholder: '@',
            validator: '@',
            chars: '@',
            data: '@',
            outerHTML: '@'
        },
        /*templateUrl: function(element, attrs) {
            // console.log('attrs ====', attrs);
            console.log('attrs ====', element, element[0].outerHTML);
            // return attrs.templateUrl || TEMPLATE_URL;
        },*/
        link: function(scope, iElement, iAttrs) {
            var ele = $(iElement);

            var onClick = function(event) {
                if (!$.contains(ele.parent(), event.target)) {
                    scope.acOutsideClick();
                    $timeout(function() {});
                }
            };

            var keyDown = function(e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode == 9) {
                    scope.acOutsideClick();
                    $timeout(function() {});
                }
            };

            document.body.addEventListener('click', onClick);
            document.body.addEventListener('keydown', keyDown);

            scope.$on('$destroy', function() {
                document.body.removeEventListener('click', onClick);
                document.body.removeEventListener('keydown', keyDown);
            });
        }
    };
}]);