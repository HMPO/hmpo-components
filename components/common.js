/* globals window, document */

(function (scope, window) {

    window.hmpoNodeListForEach = function (nodes, callback) {
        if (!nodes) return;

        if (window.NodeList.prototype.forEach) {
            return nodes.forEach(callback);
        }
        for (var i = 0; i < nodes.length; i++) {
            callback.call(window, nodes[i], i, nodes);
        }
    };

    window.hmpoOnClick = function (element, handler) {
        if (element.addEventListener) element.addEventListener('click', handler);
        else element.onclick = handler;
    };

    window.hmpoPreventDefault = function (fn) {
        return function (e) {
            e = e || window.event;
            e.preventDefault();
            if (typeof fn === 'function') fn.call(this, e);
            return false;
        };
    };

})(document, window);
