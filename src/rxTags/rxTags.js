/**
 * @ngdoc overview
 * @name rxTags
 * @description
 * # rxTags component
 *
 * A component used to apply predetermined descriptions to an entity.
 *
 * ## Directives
 * * {@link rxTags.directive:rxTags rxTags}
 *
 * ## Filters
 * * {@link rxTags.filter:xor xor}
 *
 */
angular.module('encore.ui.rxTags', ['encore.ui.rxMisc', 'ui.bootstrap'])
/**
 * @ngdoc filter
 * @name rxTags.filter:xor
 * @description
 * Returns the exclusive or of two arrays.
 *
 * @param {Array} array The first input array
 * @param {Array} excluded The second input array
 * @returns {Array} - A new array of the unique elements in each array.
 */
.filter('xor', function () {
    return function () {
        return _.xor.apply(_, arguments);
    };
})

/**
 * @ngdoc directive
 * @name rxTags.directive:rxTags
 * @description
 *
 * Like native form components, this directive uses `ng-model` to store
 * its value. The only other required attribute is `options` which accepts an
 * array of available tags that can be applied.  The tags are objects, each
 * with required `text` and `category` properties.  Any additional properties
 * will be ignored.
 * <pre>
 * $scope.colorOptions = [
 *   {
 *     "text": "blue",
 *     "category": "color"
 *   }
 *   // ...
 *  ]
 * </pre>
 *
 * By default, the model value is a subset of the options, meaning an new array
 * containing some of the same objects.  However, the `key` attribute can be
 * used to customize the model binding by selecting a single value to represent
 * the object, e.g.
 * <pre>
 * <rx-tags options="colorOptions" ng-model="colors" key="id"></rx-tags>
 * </pre>
 *
 * <pre>
 * $scope.colorOptions = [
 *  {
 *   "id": "tag0",
 *   "text": "blue",
 *   "category": "color"
 *  }
 * ]
 *
 * // $scope.colors === ["tag0"] when selected
 * </pre>
 *
 * This component can be disabled via the `disabled` attribute or `ng-disabled`
 * directive.
 * @param {Array} options - The list of available tags.
 * @param {String=} [key=undefined] - Determines a value of the tag object to
 * use when binding an option to the model.
 * If not provided, the tag object is used.
 */
.directive('rxTags', function (rxDOMHelper) {
    return {
        templateUrl: 'templates/rxTags.html',
        restrict: 'E',
        require: 'ngModel',
        scope: {
            options: '=',
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            var container = rxDOMHelper.find(element, '.rx-tags')[0];
            var input = element.find('input')[0];

            function changeFocus (event) {
                (event.target.previousElementSibling || input).focus();
            }

            attrs.$observe('disabled', function (disabled) {
                scope.disabled = (disabled === '') || disabled;
            });

            scope.focusInput = function (event) {
                if (event.target === container) {
                    input.focus();
                }
            };

            scope.removeIfBackspace = function (event, tag) {
                if (event.keyCode === 8) {
                    event.preventDefault();
                    scope.remove(tag);
                    changeFocus(event);
                }
            };

            scope.focusTag = function (event, value) {
                if (event.keyCode === 8 && _.isEmpty(value)) {
                    changeFocus(event);
                }
            };

            scope.add = function (tag) {
                scope.tags.push(tag);
                ngModelCtrl.$setViewValue(scope.tags);
                scope.newTag = '';
            };

            scope.remove = function (tag) {
                _.remove(scope.tags, tag);
                ngModelCtrl.$setViewValue(scope.tags);
                input.focus();
            };

            if (!_.isEmpty(attrs.key)) {
                ngModelCtrl.$parsers.push(function ($viewValue) {
                    return _.pluck($viewValue, attrs.key);
                });

                ngModelCtrl.$formatters.push(function ($modelValue) {
                    return scope.options.filter(function (option) {
                        return _.contains($modelValue, option[attrs.key]);
                    });
                });
            }

            ngModelCtrl.$render = function () {
                scope.tags = ngModelCtrl.$viewValue || [];
            };
        }
    };
});