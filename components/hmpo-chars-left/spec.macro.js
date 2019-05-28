'use strict';

describe('hmpoCharsLeft', () => {
    it('renders with default text', () => {
        const $ = render({ component: 'hmpoCharsLeft', params: { id: 'input-id' } });
        const $component = $('[data-module="hmpo-chars-left"]');
        expect($component.attr('data-chars-left-input')).to.equal('input-id');
        expect($component.attr('data-chars-left-template')).to.equal('{count} character{s} remaining');
        expect($component.attr('data-chars-left-default')).to.equal('{max} characters maximum');
    });

    it('renders with supplied html', () => {
        const $ = render({ component: 'hmpoCharsLeft', params: {
            id: 'input-id',
            html: '{max} default text',
            templateHtml: '{count} template text'
        } });
        const $component = $('[data-module="hmpo-chars-left"]');
        expect($component.attr('data-chars-left-input')).to.equal('input-id');
        expect($component.attr('data-chars-left-template')).to.equal('{count} template text');
        expect($component.attr('data-chars-left-default')).to.equal('{max} default text');
    });
});
