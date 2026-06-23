'use strict';

describe('hmpo template', () => {
    it('renders', () => {
        expect(() => {
            render({ template: 'hmpo-template.njk' });
        }).to.not.throw();
    });

    it('renders GOV.UK Frontend v6 template blocks', () => {
        const $ = render(
            { template: 'hmpo-template.njk' },
            { backLink: '/previous-page' }
        );

        expect($('.govuk-skip-link').length).to.equal(1);
        expect($('.hmpo-cookie-banner').length).to.equal(1);
        expect($('.govuk-header').length).to.equal(1);
        expect($('.govuk-service-navigation').length).to.equal(1);
        expect($('#back .govuk-back-link').attr('href')).to.equal('/previous-page');
    });
});
