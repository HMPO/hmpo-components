'use strict';

describe('hmpo template', () => {
    it('renders', () => {
        const locals = {};
        expect(() => {
            render({ template: 'hmpo-template.njk', locals });
        }).to.not.throw();
    });
});
