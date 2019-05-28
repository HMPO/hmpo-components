describe('hmpoFooter', () => {
    it('entire component must have a role of `contentinfo`', () => {
        const $ = render({ component: 'hmpoFooter', params: {} });

        const $component = $('.govuk-footer');
        expect($component.attr('role')).equal('contentinfo');
    });

    it('renders attributes correctly', () => {
        const $ = render({ component: 'hmpoFooter', params: {
            attributes: {
                'data-test-attribute': 'value',
                'data-test-attribute-2': 'value-2'
            }
        }});

        const $component = $('.govuk-footer');
        expect($component.attr('data-test-attribute')).equal('value');
        expect($component.attr('data-test-attribute-2')).equal('value-2');
    });

    it('renders classes', () => {
        const $ = render({ component: 'hmpoFooter', params: {
            classes: 'app-footer--custom-modifier'
        }});

        const $component = $('.govuk-footer');
        expect($component.hasClass('app-footer--custom-modifier')).to.be.true;
    });

    it('renders custom container classes', () => {
        const $ = render({ component: 'hmpoFooter', params: {
            containerClasses: 'app-width-container'
        }});

        const $component = $('.govuk-footer');
        const $container = $component.find('.govuk-width-container');

        expect($container.hasClass('app-width-container')).to.be.true;
    });

    describe('meta', () => {
        it('renders custom meta text', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                meta: {
                    text: 'GOV.UK Prototype Kit <strong>v7.0.1</strong>'
                }
            }});

            const $component = $('.govuk-footer');
            const $custom = $component.find('.govuk-footer__meta-custom');
            expect($custom.text()).contain('GOV.UK Prototype Kit <strong>v7.0.1</strong>');
        });

        it('renders custom meta html', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                meta: {
                    html: 'GOV.UK Prototype Kit <strong>v7.0.1</strong>'
                }
            }});

            const $component = $('.govuk-footer');
            const $custom = $component.find('.govuk-footer__meta-custom');
            expect($custom.text()).contain('GOV.UK Prototype Kit v7.0.1');
        });

        it('renders custom licence text', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                licence: {
                    text: 'GOV.UK Licence'
                }
            }});

            const $component = $('.govuk-footer');
            const $custom = $component.find('.govuk-footer__licence-description');
            expect($custom.text()).contain('GOV.UK Licence');
        });

        it('renders custom licence text', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                licence: {
                    html: 'GOV.UK Licence'
                }
            }});

            const $component = $('.govuk-footer');
            const $custom = $component.find('.govuk-footer__licence-description');
            expect($custom.text()).contain('GOV.UK Licence');
        });

        it('renders attributes on meta links', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                meta: {
                    items: [
                        {
                            href: '#1',
                            text: 'meta item 1',
                            attributes: {
                                'data-attribute': 'my-attribute',
                                'data-attribute-2': 'my-attribute-2'
                            }
                        }
                    ]
                }
            }});

            const $metaLink = $('.govuk-footer__meta .govuk-footer__link');
            expect($metaLink.attr('data-attribute')).equal('my-attribute');
            expect($metaLink.attr('data-attribute-2')).equal('my-attribute-2');
        });
    });

    describe('navigation', () => {

        it('renders attributes on links', () => {
            const $ = render({ component: 'hmpoFooter', params: {
                navigation: [
                    {
                        items: [
                            {
                                href: '#1',
                                text: 'Navigation item 1',
                                attributes: {
                                    'data-attribute': 'my-attribute',
                                    'data-attribute-2': 'my-attribute-2'
                                }
                            }
                        ]
                    }
                ]
            }});
            const $navigationLink = $('.govuk-footer__list .govuk-footer__link');
            expect($navigationLink.attr('data-attribute')).equal('my-attribute');
            expect($navigationLink.attr('data-attribute-2')).equal('my-attribute-2');
        });
    });
});
