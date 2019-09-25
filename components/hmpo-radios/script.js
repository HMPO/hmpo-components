window.GOVUKFrontend.Radios.prototype.originalSetAttributes = window.GOVUKFrontend.Radios.prototype.setAttributes;

window.GOVUKFrontend.Radios.prototype.setAttributes = function ($input) {
    var isMulti = Boolean(this.$module.getAttribute('data-multi-conditional'));
    if (!isMulti) {
        return window.GOVUKFrontend.Radios.prototype.originalSetAttributes.apply(this, arguments);
    }

    var controls = $input.getAttribute('aria-controls');
    var $content = this.$module.querySelector('#' + controls);
    if (!$content) return;

    var conditionMet = false;
    var $allInputs = document.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < $allInputs.length; i++) {
        var $otherInput = $allInputs[i];
        var otherInputControls = $otherInput.getAttribute('data-aria-controls') || $otherInput.getAttribute('aria-controls');
        if (controls === otherInputControls && $otherInput.checked) conditionMet = true;
    }

    $input.setAttribute('aria-expanded', conditionMet);
    $content.classList.toggle('govuk-radios__conditional--hidden', !conditionMet);
};
