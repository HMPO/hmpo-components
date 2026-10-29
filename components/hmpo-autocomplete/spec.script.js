'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('hmpoAutocomplete JavaScript behaviour', () => {
    const script = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');
    let document, window, selects, inputs, enhance;

    function element(attributes) {
        return {
            attributes,
            listeners: {},
            value: '',
            selectedIndex: 1,
            getAttribute(name) {
                return this.attributes[name] === undefined ? null : this.attributes[name];
            },
            setAttribute(name, value) {
                this.attributes[name] = value;
            },
            removeAttribute(name) {
                delete this.attributes[name];
            },
            addEventListener(name, callback) {
                this.listeners[name] = callback;
            }
        };
    }

    function run() {
        vm.runInNewContext(script, { document, window });
    }

    beforeEach(() => {
        selects = [element({ name: 'answers[country]' }), element({ name: 'destination' })];
        selects[0].id = 'country';
        selects[1].id = 'destination';
        inputs = {
            country: element({ 'aria-describedby': 'country__assistiveHint' }),
            destination: element({})
        };
        enhance = sinon.spy();
        document = {
            readyState: 'complete',
            querySelectorAll: sinon.stub().returns(selects),
            getElementById: id => inputs[id],
            addEventListener: sinon.spy()
        };
        window = {
            MutationObserver: sinon.stub().returns({ observe: sinon.spy() }),
            GOVUKPrototypeComponents: {
                Autocomplete: function (select) {
                    this.init = () => enhance(select);
                }
            },
            hmpoNodeListForEach: (nodes, callback) => nodes.forEach(callback),
            hmpoOn: (name, node, callback) => node.addEventListener(name, callback)
        };
    });

    it('enhances all matching selects once, even if the script is loaded twice', () => {
        run();
        run();
        expect(document.querySelectorAll).to.have.been.calledWith('select[data-module="autocomplete"]');
        expect(enhance).to.have.been.calledTwice;
        expect(enhance.firstCall).to.have.been.calledWith(selects[0]);
        expect(enhance.secondCall).to.have.been.calledWith(selects[1]);
        expect(selects[0].getAttribute('data-loaded')).to.equal('true');
    });

    it('waits for DOMContentLoaded when loaded before the markup', () => {
        document.readyState = 'loading';
        run();
        expect(enhance).not.to.have.been.called;
        expect(document.addEventListener).to.have.been.calledWith('DOMContentLoaded');
        document.addEventListener.firstCall.args[1]();
        expect(enhance).to.have.been.calledTwice;
    });

    it('does not initialise unrelated X-GOV.UK components', () => {
        window.GOVUKPrototypeComponents.initAll = sinon.spy();
        run();
        expect(window.GOVUKPrototypeComponents.initAll).not.to.have.been.called;
    });

    it('does nothing on pages without autocomplete', () => {
        selects.length = 0;
        run();
        expect(enhance).not.to.have.been.called;
    });

    it('clears stale selections when the input is edited and preserves the field name', () => {
        run();
        inputs.country.value = 'New query';
        inputs.country.listeners.input();
        expect(selects[0].selectedIndex).to.equal(-1);
        expect(selects[0].getAttribute('name')).to.equal('answers[country]');
        expect(selects[1].selectedIndex).to.equal(1);
    });

    it('omits empty answers and restores the original name after typing again', () => {
        run();
        inputs.country.listeners.input();
        expect(selects[0].getAttribute('name')).to.equal(null);
        inputs.country.value = 'France';
        inputs.country.listeners.input();
        expect(selects[0].getAttribute('name')).to.equal('answers[country]');
    });

    it('synchronises empty answers on blur and change', () => {
        run();
        inputs.country.listeners.blur();
        expect(selects[0].getAttribute('name')).to.equal(null);
        inputs.country.value = 'France';
        inputs.country.listeners.change();
        expect(selects[0].getAttribute('name')).to.equal('answers[country]');
    });

    it('does not invent names for unnamed selects', () => {
        selects[0].removeAttribute('name');
        run();
        inputs.country.value = 'France';
        inputs.country.listeners.change();
        expect(selects[0].getAttribute('name')).to.equal(null);
    });

    it('preserves explicit accessible labels and combines hint and error references', () => {
        selects[0].setAttribute('aria-label', 'Country');
        selects[0].setAttribute('aria-labelledby', 'country-label');
        selects[0].setAttribute('aria-describedby', 'country-hint country-error');
        run();
        expect(inputs.country.getAttribute('aria-label')).to.equal('Country');
        expect(inputs.country.getAttribute('aria-labelledby')).to.equal('country-label');
        expect(inputs.country.getAttribute('aria-describedby'))
            .to.equal('country-hint country-error country__assistiveHint');
    });

    it('restores hint and error references after upstream re-renders without duplicating them', () => {
        selects[0].setAttribute('aria-describedby', 'country-hint country-error');
        run();
        const syncDescription = window.MutationObserver.firstCall.args[0];
        inputs.country.removeAttribute('aria-describedby');
        syncDescription();
        expect(inputs.country.getAttribute('aria-describedby')).to.equal('country-hint country-error');
        inputs.country.setAttribute('aria-describedby', 'country__assistiveHint');
        syncDescription();
        syncDescription();
        expect(inputs.country.getAttribute('aria-describedby'))
            .to.equal('country-hint country-error country__assistiveHint');
    });

    it('surfaces enhancement failures without marking the select as loaded', () => {
        window.GOVUKPrototypeComponents.Autocomplete = function () {
            this.init = () => { throw new Error('Enhancement failed'); };
        };
        expect(run).to.throw('Enhancement failed');
        expect(selects[0].getAttribute('data-loaded')).to.equal(null);
    });
});
