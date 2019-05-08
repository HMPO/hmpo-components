'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const cheerio = require('cheerio');
const chai = require('chai');
const globals = require('../lib/globals');

global.should = chai.should();
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(require('sinon-chai'));

const views = [
    path.resolve(__dirname, '..', 'components'),
    path.resolve(__dirname, '..', 'node_modules', 'govuk-frontend'),
    path.resolve(__dirname, '..', 'node_modules', 'govuk-frontend', 'components')
];
let nunjucksEnv = nunjucks.configure(views, {
    trimBlocks: true,
    lstripBlocks: true
});
globals.addGlobals(nunjucksEnv);

global.render = (macroName, params, context, children = false) => {
    let macroParams = JSON.stringify(params, null, 2);
    if (context) {
        macroParams = 'ctx, ' + macroParams;
    }
    context = context || {};
    context.translate = context.translate || (key => Array.isArray(key) ? key[0] : key);
    context.ctx = key => key ? key.split('.').reduce((a, k) => a && a[k], context) : context;

    let macroPath = macroName.replace(/([A-Z])/g, '-$1').toLowerCase();
    let macroString = `{%- from "${macroPath}/macro.njk" import ${macroName} -%}`;

    if (children) {
        macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`;
    } else {
        macroString += `{{- ${macroName}(${macroParams}) -}}`;
    }

    let output = nunjucksEnv.renderString(macroString, context);

    output = output.replace(/(^ +|\n *| +$| +$)/g, '');
    output = output.replace(/> +</g, '><');

    return cheerio.load(output);
};
