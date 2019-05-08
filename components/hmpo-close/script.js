/* globals window, document */

(function (scope, window) {
    'use strict';

    if (!window.opener || !window.close) return;

    if (window.opener && window.close) {
        var $closeButtons = scope.querySelector('[data-module="hmpo-close"]');

        window.hmpoNodeListForEach($closeButtons, function (element) {
            element.style.display = 'block';
            window.hmpoOnClick(element, window.hmpoPreventDefault(window.close));
        });
    }

})(document, window);
