'use strict';

const index = require('../');

describe('Template Mixins', () => {

    it('returns a setup function', () => {
        index.setup.should.be.a('function');
    });

    it('exports mixin controllers', () => {
        index.mixins.should.equal(require('../lib/mixins'));
    });

    it('exports the Date mixin controller', () => {
        index.mixins.Date.should.equal(require('../lib/mixins/date'));
    });
});
