(function (scope, window) {
    'use strict';

    function Autocomplete($select) {
        if ($select.getAttribute('data-loaded')) return;

        var id = $select.id;
        var name = $select.getAttribute('name');

        new window.GOVUKPrototypeComponents.Autocomplete($select).init();

        var $input = scope.getElementById(id);
        var label = $select.getAttribute('aria-label');
        var labelledBy = $select.getAttribute('aria-labelledby');
        var describedBy = $select.getAttribute('aria-describedby');

        if (label) $input.setAttribute('aria-label', label);
        if (labelledBy) $input.setAttribute('aria-labelledby', labelledBy);
        if (describedBy) {
            function syncDescription() {
                var current = $input.getAttribute('aria-describedby') || '';
                var references = (describedBy + ' ' + current).trim().split(/\s+/);
                var combined = references.filter(function (reference, index) {
                    return references.indexOf(reference) === index;
                }).join(' ');
                if (combined !== current) $input.setAttribute('aria-describedby', combined);
            }

            // Upstream re-renders this attribute as the query changes.
            var observer = new window.MutationObserver(syncDescription);
            observer.observe($input, { attributes: true, attributeFilter: ['aria-describedby'] });
            syncDescription();
        }

        function syncName() {
            if ($input.value && name !== null) {
                $select.setAttribute('name', name);
            } else {
                $select.removeAttribute('name');
            }
        }

        window.hmpoOn('input', $input, function () {
            $select.selectedIndex = -1;
            syncName();
        });
        window.hmpoOn('blur', $input, syncName);
        window.hmpoOn('change', $input, syncName);

        $select.setAttribute('data-loaded', 'true');
    }

    function init() {
        var $elements = scope.querySelectorAll('select[data-module="autocomplete"]');
        window.hmpoNodeListForEach($elements, function ($element) { new Autocomplete($element); });
    }

    if (scope.readyState === 'loading') {
        window.hmpoOn('DOMContentLoaded', scope, init);
    } else {
        init();
    }
})(document, window);
