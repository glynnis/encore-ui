angular.module('encore.ui.utilities')
/**
 * @ngdoc filter
 * @name utilities.filter:rxTitleize
 * @description
 * Convert a string to title case, stripping out underscores and capitalizing words.
 *
 * Credit where it's due: https://github.com/epeli/underscore.string/blob/master/titleize.js
 *
 * @param {String} inputString - The string to convert
 * @returns {String} The titleized version of the string
 *
 * @example
 * Both examples result in a string of `"A Simple String"`.
 * <pre>
 * {{ 'a simple_STRING' | rxTitleize }}
 * </pre>
 *
 * <pre>
 * $filter('titleize')('a simple_STRING');
 * </pre>
 */
.filter('rxTitleize', function () {
    return function (inputString) {
        return inputString
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/(?:^|\s)\S/g, function (character) {
                return character.toUpperCase();
            });
    };
}).filter('titleize', function ($filter) {
    console.warn(
        'DEPRECATED: titleize - Please use rxTitleize. ' +
        'titleize will be removed in EncoreUI 4.0.0'
    );

    return $filter('rxTitleize');
});
