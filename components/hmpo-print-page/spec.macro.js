'use strict';

describe('hmpoPrintPage', () => {
    it('renders with text', () => {
        const $ = render('hmpoPrintPage', { text: 'test' });
        const $component = $('.hmpo-print-page');
        expect($component.html().trim()).to.equal('<a data-module="hmpo-print-page" rel="alternate" href="#" class="govuk-link">test</a>');
    });

    it('renders with html', () => {
        const $ = render('hmpoPrintPage', { html: '<b>html</b>' });
        const $component = $('.hmpo-print-page');
        expect($component.html().trim()).to.equal('<a data-module="hmpo-print-page" rel="alternate" href="#" class="govuk-link"><b>html</b></a>');
    });

    it('renders with default text', () => {
        const $ = render('hmpoPrintPage');
        const $component = $('.hmpo-print-page');
        expect($component.html().trim()).to.equal('<a data-module="hmpo-print-page" rel="alternate" href="#" class="govuk-link">Print page</a>');
    });
});
