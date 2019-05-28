'use strict';

describe('hmpoCircleStepList', () => {
    it('renders with params', () => {
        const $ = render({ component: 'hmpoCircleStepList', params: {
            attributes: { attrib1: 'value1' },
            classes: 'classes',
            itemAttributes: { itemAttrib1: 'itemValue1' },
            itemClasses: 'itemClasses',
            circleClasses: 'circleClasses',
            items: [
                { text: 'text <br>' },
                { html: 'html <br>' },
                { number: 7, text: 'custom number' },
                {
                    attributes: { attribs: 'overridden'},
                    classes: 'overridden classes',
                    circleClasses: 'overridden circleClasses',
                    text: 'overridden'
                },
                'string html <br>',
                { title: 'title', text: 'text <br>' },

            ]
        }});

        const $ul = $('ul');
        expect($ul.attr('class')).to.equal('classes');
        expect($ul.attr('attrib1')).to.equal('value1');

        const $li = $('li');
        const $li0 = $($li.get(0));
        expect($li0.attr('class')).to.equal('itemClasses');
        expect($li0.attr('itemattrib1')).to.equal('itemValue1');
        expect(cleanHtml($li0)).to.equal('<span class="circle-step circleClasses">1</span><p>text &lt;br&gt;</p>');

        const $li1 = $($li.get(1));
        expect(cleanHtml($li1)).to.equal('<span class="circle-step circleClasses">2</span><p>html <br></p>');

        const $li2 = $($li.get(2));
        expect(cleanHtml($li2)).to.equal('<span class="circle-step circleClasses">7</span><p>custom number</p>');

        const $li3 = $($li.get(3));
        expect($li3.attr('class')).to.equal('overridden classes');
        expect($li3.attr('attribs')).to.equal('overridden');
        expect(cleanHtml($li3)).to.equal('<span class="circle-step overridden circleClasses">4</span><p>overridden</p>');

        const $li4 = $($li.get(4));
        expect(cleanHtml($li4)).to.equal('<span class="circle-step circleClasses">5</span><p>string html <br></p>');
        const $li5 = $($li.get(5));
        expect(cleanHtml($li5)).to.equal('<span class="circle-step circleClasses">6</span><h2>title</h2><p>text &lt;br&gt;</p>');

    });
});
