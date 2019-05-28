'use strict';

describe('hmpoCircleStep', () => {
    it('renders with params', () => {
        const $ = render({ component: 'hmpoCircleStep', params: {
            number: 4,
            text: 'my text',
            attributes: { attrib1: 'value1' },
            classes: 'classes',
            circleClasses: 'circleClasses'
        }});

        const $component = $('body');
        expect(cleanHtml($component)).to.equal('<li class="classes" attrib1="value1"><span class="circle-step circleClasses">4</span><p>my text</p></li>');
    });

    it('renders with text', () => {
        const $ = render({ component: 'hmpoCircleStep', params: { text: 'my text <br>' } });

        const $component = $('p');
        expect(cleanHtml($component)).to.equal('my text &lt;br&gt;');
    });

    it('renders with html', () => {
        const $ = render({ component: 'hmpoCircleStep', params: { html: 'my text <br>' } });

        const $component = $('p');
        expect(cleanHtml($component)).to.equal('my text <br>');
    });

});
