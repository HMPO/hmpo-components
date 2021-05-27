'use strict';

describe('app template', () => {
    it('renders', () => {
        expect(() => {
            render({ template: 'app-template.njk' });
        }).to.not.throw();
    });
});
