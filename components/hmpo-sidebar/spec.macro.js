'use strict';

describe('hmpoSidebar', () => {
    it('renders with caller', () => {
        const caller = '<b>test</b>';
        const $ = render({ component: 'hmpoSidebar', caller });
        const $component = $('div').parent();
        expect(cleanHtml($component)).to.equal('<div class="hmpo-sidebar"><div class="hmpo-sidebar__inner"><b>test</b></div></div>');
    });

    it('renders with extra classes', () => {
        const caller = '<b>test</b>';
        const $ = render({ component: 'hmpoSidebar', params: { classes: 'test' }, caller });
        const $component = $('div').parent();
        expect(cleanHtml($component)).to.equal('<div class="hmpo-sidebar test"><div class="hmpo-sidebar__inner"><b>test</b></div></div>');
    });

    it('renders with extra attributes', () => {
        const caller = '<b>test</b>';
        const $ = render({ component: 'hmpoSidebar', params: { attributes: { key: 'value' } }, caller });
        const $component = $('div').parent();
        expect(cleanHtml($component)).to.equal('<div class="hmpo-sidebar" key="value"><div class="hmpo-sidebar__inner"><b>test</b></div></div>');
    });
});
