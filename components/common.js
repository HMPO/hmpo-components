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

    window.hmpoOn = function (name, element, handler) {
        if (element.addEventListener) element.addEventListener(name, handler);
        else element['on' + name] = handler;
    };

    window.hmpoOnClick = function (element, handler) {
        return window.hmpoOn('click', element, handler);
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
