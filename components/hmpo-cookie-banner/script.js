/* globals document */

(function () {
    'use strict';
    var setCookie = function (name, value, days) {
        var cookieString = name + '=' + value + '; path=/';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieString = cookieString + '; expires=' + date.toGMTString();
        }
        if (document.location.protocol === 'https:') {
            cookieString = cookieString + '; Secure';
        }
        document.cookie = cookieString;
    };

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
        var cookieName = message.getAttribute && message.getAttribute('cookie-name') || 'seen_cookie_message';
        var cookieDays = message.getAttribute && parseInt(message.getAttribute('cookie-days'), 10) || 28;
        if (!getCookie(cookieName)) {
            message.style.display = 'block';
            setCookie(cookieName, 'yes', cookieDays);
        }
    }
})();
