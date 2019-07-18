(function (scope, window) {
    'use strict';

    if (!window.print) return;

    var print = function () {
        window.print();
    };

    var $printLinks = scope.querySelectorAll('[data-module="hmpo-print-page"]');

    window.hmpoNodeListForEach($printLinks, function (element) {
        window.hmpoOnClick(element, window.hmpoPreventDefault(print));
    });

})(document, window);
