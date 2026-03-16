'use strict';

describe('task list template', () => {
    let locals;

    beforeEach(() => {
        locals = {
            options: {
                route: '/task-list',
                fields: {
                    taskList: {
                        type: 'task-list',
                        statuses: {
                            'default': 'blue',
                            completed: false
                        },
                        tasks: [
                            { id: 'taskOne', href: '/task-one', statusField: 'taskOneStatus' }
                        ]
                    }
                }
            },
            values: {}
        };
    });

    it('renders without throwing', () => {
        expect(() => {
            render({ template: 'task-list-template.njk' }, locals);
        }).to.not.throw();
    });

    it('renders the task list', () => {
        const $ = render({ template: 'task-list-template.njk' }, locals);
        expect($('.govuk-task-list').length).to.equal(1);
    });

    it('renders the submit button', () => {
        const $ = render({ template: 'task-list-template.njk' }, locals);
        expect($('.govuk-button').length).to.equal(1);
    });

    it('does not render a form', () => {
        const $ = render({ template: 'task-list-template.njk' }, locals);
        expect($('form').length).to.equal(0);
    });
});
