'use strict';

describe('hmpo template', () => {
    it('renders', () => {
        expect(() => {
            render({ template: 'hmpo-template.njk' });
        }).to.not.throw();
    });
});
