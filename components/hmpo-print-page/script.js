/* globals window, document */

(function (scope, window) {
    'use strict';

    if (!window.print) return;

    var $printLinks = scope.querySelector('[data-module="hmpo-print-page"]');

    window.hmpoNodeListForEach($printLinks, function (element) {
        window.hmpoOnClick(element, window.hmpoPreventDefault(window.print));
    });

})(document, window);
