'use strict';

describe('hmpoDetails', () => {
    it('renders with text', () => {
        const $ = render('hmpoDetails', { text: 'my text <br>' });

        const $component = $('div');
        expect($component.html().trim()).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render('hmpoDetails', { html: 'my text <br>' });

        const $component = $('div');
        expect($component.html().trim()).to.equal('my text <br>');
    });

    it('renders with caller', () => {
        const $ = render('hmpoDetails', { html: 'my text <br>' }, null, '<br>caller text<br>');

        const $component = $('div');
        expect($component.html().trim()).to.equal('<br>caller text<br>');
    });
});
