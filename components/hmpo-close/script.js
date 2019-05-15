/* globals window, document */

(function (scope, window) {
    'use strict';

    if (!window.opener || !window.close) return;

    var $closeButtonDivs = scope.querySelectorAll('[data-module="hmpo-close"]');

    window.hmpoNodeListForEach($closeButtonDivs, function (element) {
        var html = element.getAttribute('data-button');
        element.innerHTML = html;
    });

    setTimeout(function () {
        var close = window.hmpoPreventDefault(function () {
            window.close();
        });

        var $closeButtons = scope.querySelectorAll('[data-module="hmpo-close"] button');
        window.hmpoNodeListForEach($closeButtons, function (element) {
            window.hmpoOnClick(element, close);
        });
    });

})(document, window);
