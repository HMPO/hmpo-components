(function (scope, window) {
    'use strict';

    function AutoSubmit($element) {
        this.$element = $element;

        // once
        if ($element.getAttribute('data-loaded')) return;
        $element.setAttribute('data-loaded', true);

        // get settings
        this.cloneForm = $element.getAttribute('data-clone-form') === 'true';
        this.submitDelay = parseInt($element.getAttribute('data-submit-delay'), 10) || 0;
        this.helpDelay = parseInt($element.getAttribute('data-help-delay'), 10) || null;
        this.manualDelay = parseInt($element.getAttribute('data-manual-delay'), 10) || null;

        // get elements
        this.getElements();

        this.submitTimer = setTimeout(this.submit.bind(this), this.submitDelay);
        if (this.helpDelay) this.helpTimer = setTimeout(this.showHelp.bind(this), this.helpDelay);
        if (this.manualDelay) this.manualTimer = setTimeout(this.showManual.bind(this), this.manualDelay);
    }

    AutoSubmit.prototype.getElements = function () {
        this.$help = this.$element.querySelectorAll('.hmpo-auto-submit__help')[0];
        this.$manual = this.$element.querySelectorAll('.hmpo-auto-submit__manual')[0];
        this.$submitButton = this.$manual.querySelectorAll('button')[0];
        this.$form = this.$submitButton.form;
    };

    AutoSubmit.prototype.submit = function () {
        if (this.cloneForm && this.$form.cloneNode) {
            var formClone = this.$form.cloneNode(true);
            this.$form.replaceWith(formClone);
            this.getElements();
        }
        this.$form.submit();
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
        addEvent(window, 'load', callback);
    }

    function init() {
        var $elements = scope.querySelectorAll('[data-module="hmpo-auto-submit"]');
        window.hmpoNodeListForEach($elements, function ($element) { new AutoSubmit($element); });
    }

    documentReady(init);

})(document, window);
