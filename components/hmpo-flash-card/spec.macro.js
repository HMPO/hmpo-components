'use strict';

describe('hmpoFlashCard', () => {

    it('renders with a default class', () => {
        const $ = render({ component: 'hmpoFlashCard', params: {} });

        const $component = $('div');
        expect($component.attr('class')).to.equal('flash-card');
    });

    it('renders with a added class', () => {
        const $ = render({ component: 'hmpoFlashCard', params: {classes: 'test'} });

        const $component = $('div');
        expect($component.attr('class')).to.equal('flash-card test');
    });

    it('renders caller children', () => {
        const caller = '<span id="child"></span>';
        const $ = render({ component: 'hmpoFlashCard', params: {}, caller});

        const $children = $('div #child');
        expect($children.length).to.equal(1);
    });

});
