'use strict';

describe('hmpoClose', () => {
    it('renders with text', () => {
        const $ = render({ component: 'hmpoClose', params: { text: 'test' } });
        const $component = $('div');
        expect($component.attr('data-button')).to.equal('  <button type="button" class="govuk-button">  test</button>');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoClose', params: { html: '<b>html</b>' } });
        const $component = $('div');
        expect($component.attr('data-button')).to.equal('  <button type="button" class="govuk-button">  <b>html</b></button>');
    });

    it('renders with default text', () => {
        const $ = render({ component: 'hmpoClose' });
        const $component = $('div');
        expect($component.attr('data-button')).to.equal('  <button type="button" class="govuk-button">  Close</button>');
    });
});
