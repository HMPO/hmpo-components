'use strict';

describe('hmpoCircleStep', () => {
    it('renders with params', () => {
        const $ = render('hmpoCircleStep', {
            number: 4,
            text: 'my text',
            attributes: { attrib1: 'value1' },
            classes: 'classes',
            circleClasses: 'circleClasses'
        });

        const $component = $('body');
        expect($component.html().trim()).to.equal('<li class="classes" attrib1="value1"><span class="circle-step circleClasses">4</span><p>my text</p></li>');
    });

    it('renders with text', () => {
        const $ = render('hmpoCircleStep', { text: 'my text <br>' });

        const $component = $('p');
        expect($component.html().trim()).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render('hmpoCircleStep', { html: 'my text <br>' });

        const $component = $('p');
        expect($component.html().trim()).to.equal('my text <br>');
    });

});
