(function (scope, window) {
    'use strict';

    function AutoSubmit($element) {
        this.$element = $element;

        // once
        if ($element.getAttribute('data-loaded')) return;
        $element.setAttribute('data-loaded', true);

        // get settings
        this.submitDelay = parseInt($element.getAttribute('data-submit-delay'), 10) || 0;
        this.helpDelay = parseInt($element.getAttribute('data-help-delay'), 10) || null;
        this.manualDelay = parseInt($element.getAttribute('data-manual-delay'), 10) || null;

        // get elements
        this.$help = $element.querySelectorAll('.hmpo-auto-submit__help')[0];
        this.$manual = $element.querySelectorAll('.hmpo-auto-submit__manual')[0];
        this.$submitButton = this.$manual.querySelectorAll('button')[0];

        this.load();

        if ('onpagehide' in window) {
            addEvent(window, 'pagehide', this.unload.bind(this));
        } else {
            addEvent(window, 'unload', this.unload.bind(this));
        }
    }

    AutoSubmit.prototype.load = function () {
        this.submitTimer = setTimeout(this.submit.bind(this), this.submitDelay);
        if (this.helpDelay) this.helpTimer = setTimeout(this.showHelp.bind(this), this.helpDelay);
        if (this.manualDelay) this.manualTimer = setTimeout(this.showManual.bind(this), this.manualDelay);
    };

    AutoSubmit.prototype.unload = function () {
        clearTimeout(this.submitTimer);
        clearTimeout(this.helpTimer);
        clearTimeout(this.manualTimer);
    };

    AutoSubmit.prototype.submit = function () {
        this.$submitButton.form.submit();
    };

    AutoSubmit.prototype.showHelp = function () {
        this.$element.className = this.$element.className + ' hmpo-auto-submit__show-help';
    };

    AutoSubmit.prototype.showManual = function () {
        this.$element.className = this.$element.className + ' hmpo-auto-submit__show-manual';
    };

    function addEvent(el, type, callback) {
        if (el.addEventListener) {
            el.addEventListener(type, callback, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, callback);
        }
    }

    function documentReady(callback) {
        addEvent(document, 'DOMContentLoaded', callback);
        addEvent(window, 'load', callback);
    }

    function init() {
        var $elements = scope.querySelectorAll('[data-module="hmpo-auto-submit"]');
        window.hmpoNodeListForEach($elements, function ($element) { new AutoSubmit($element); });
    }

    documentReady(init);

})(document, window);
