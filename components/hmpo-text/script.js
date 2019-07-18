(function (scope, window) {

    documentReady(noPaste);

    function documentReady(callback) {
        addEvent(document, 'DOMContentLoaded', callback);
        addEvent(window, 'load', callback);
    }

    function each(a, cb) {
        a = [].slice.call(a);
        for (var i = 0; i < a.length; i++) cb(a[i], i, a);
    }


    var prevent = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = true;
        return false;
    };

    function hasClass(el, className) {
        return el.className.split(/\s/).indexOf(className) !== -1;
    }

    function getElementsByClass(parent, tag, className) {
        if (parent.getElementsByClassName) {
            return parent.getElementsByClassName(className);
        } else {
            var elems = [];
            each(parent.getElementsByTagName(tag), function (t) {
                if (hasClass(t, className)) {
                    elems.push(t);
                }
            });
            return elems;
        }
    }

    function noPaste() {
        var elements = getElementsByClass(document, ['input'], 'js-nopaste');
        each(elements, function (element) {
            once(element, 'js-nopaste', function () {
                addEvent(element, 'paste', prevent);
                addEvent(element, 'dragdrop', prevent);
                addEvent(element, 'drop', prevent);
            });
        });
    }

    function once(elem, key, callback) {
        if (!elem) {
            return;
        }
        elem.started = elem.started || {};
        if (!elem.started[key]) {
            elem.started[key] = true;
            callback(elem);
        }
    }

    function addEvent(el, type, callback) {
        if (el.addEventListener) {
            el.addEventListener(type, callback, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, callback);
        }
    }
})(document, window);
