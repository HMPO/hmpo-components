'use strict';

const nunjucksTest = require('hmpo-nunjucks-test');
const path = require('path');
const chai = require('chai');

global.should = chai.should();
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(require('sinon-chai'));

const views = [
    path.resolve(__dirname, '..', 'components'),
    path.resolve(__dirname, '..', 'node_modules', 'govuk-frontend'),
];

global.render = nunjucksTest.renderer(views);
global.cleanHtml = nunjucksTest.cleanHtml;
