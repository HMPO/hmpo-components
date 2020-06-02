(function () {
    'use strict';
    var getCookie = function (name) {
        var nameEQ = name + '=';
        var cookies = document.cookie.split(';');
        for (var i = 0, len = cookies.length; i < len; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    };

    var message = document.getElementsByClassName('js-cookie-banner')[0];
    if (message) {
        var cookieName = message.getAttribute && message.getAttribute('cookie-name') || 'ga-opt-in';
        if (!getCookie(cookieName)) {
            message.style.display = 'block';
        }
    }
})();
