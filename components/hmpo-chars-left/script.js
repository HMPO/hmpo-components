/* globals window, document */

(function (scope, window) {
    'use strict';

    var throttle = function (fn, time) {
        var timer;
        return function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                timer = null;
                fn();
            }, time);
        };
    };

    var charsleftHandler = function (input, element, max, defaultHtml, templateHtml, showAt) {
        var value = input.value || '';
        // javascript is given \n for new lines but they are POSTed as \r\n
        value = value.replace(/\r?\n/g, '\r\n');
        var length = value.length || 0,
            remaining = max - length;
        if (remaining < 0) {
            input.value = value.substr(0, max);
            remaining = 0;
        }

        if (!showAt || remaining <= showAt) {
            element.innerHTML = templateHtml.replace('{count}', remaining).replace('{s}', remaining === 1 ? '' : 's');
        } else {
            element.innerHTML = defaultHtml.replace('{max}', max);
        }
    };

    var elementHandler = function (element) {
        var inputId = element.getAttribute('data-chars-left-input');
        var input = scope.getElementById(inputId);
        if (!input) { throw new Error('input not found for hmpoCharsLeft: ' + inputId); }

        var max = parseInt(element.getAttribute('data-chars-left-max') || input.getAttribute('maxlength'), 10);
        var defaultHtml = element.getAttribute('data-chars-left-default');
        var templateHtml = element.getAttribute('data-chars-left-template');
        var showAt = parseInt(element.getAttribute('data-chars-left-showat'), 10);

        var paragraph = document.createElement('P');
        element.appendChild(paragraph);

        var handler = throttle(function () {
            charsleftHandler(input, paragraph, max, defaultHtml, templateHtml, showAt);
        }, 50);

        window.hmpoOn('keypress', input, handler); // handle new char
        window.hmpoOn('keydown', input, handler); // handle repeated backspaces
        window.hmpoOn('keyup', input, handler); // handler after backspace
        window.hmpoOn('change', input, handler); // handle pasting

        handler();
    };

    var $charsLeft = scope.querySelectorAll('[data-module="hmpo-chars-left"]');
    window.hmpoNodeListForEach($charsLeft, elementHandler);

})(document, window);
