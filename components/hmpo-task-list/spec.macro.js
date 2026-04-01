'use strict';

describe('hmpoTaskList', () => {
    let locals, tasks, statuses;

    const renderTask = (params, fieldName = 'taskList', context = locals) => {
        return render.withLocale({
            string: '{% from "hmpo-task-list/macro.njk" import hmpoTaskList %}{{ hmpoTaskList(ctx, params, "' + fieldName + '") }}',
            ctx: true
        }, Object.assign({}, context, { params }));
    };

    beforeEach(() => {
        locals = { values: {} };
        statuses = {
            'default': 'blue',
            completed: false
        };
        tasks = [
            { id: 'taskOne', href: '/task-one', statusField: 'taskOneStatus' },
            { id: 'taskTwo', href: '/task-two', statusField: 'taskTwoStatus' }
        ];
    });

    it('renders a task list with items', () => {
        const $ = renderTask({ tasks, statuses });
        expect($('.govuk-task-list__item').length).to.equal(2);
    });

    it('renders task titles from locale', () => {
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        expect($('.govuk-task-list__link').text().trim()).to.equal('Task one');
    });

    it('renders task href links', () => {
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        expect($('.govuk-task-list__link').attr('href')).to.equal('/task-one');
    });

    it('renders default status as a tag when statusField value is not set', () => {
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        const $tag = $('.govuk-tag');
        expect($tag.text().trim()).to.equal('Incomplete');
        expect($tag.attr('class')).to.contain('govuk-tag--blue');
    });

    it('renders completed status as plain text when statusField value matches', () => {
        locals.values = { taskOneStatus: 'completed' };
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        expect($('.govuk-task-list__status').text().trim()).to.equal('Completed');
        expect($('.govuk-tag').length).to.equal(0);
    });

    it('renders mixed statuses for multiple tasks', () => {
        locals.values = { taskOneStatus: 'completed' };
        const $ = renderTask({ tasks, statuses });
        const $items = $('.govuk-task-list__item');
        expect($items.eq(0).find('.govuk-task-list__status').text().trim()).to.equal('Completed');
        expect($items.eq(1).find('.govuk-tag').text().trim()).to.equal('Incomplete');
    });

    it('falls back to default when statusField value does not match any status key', () => {
        locals.values = { taskOneStatus: 'unknownState' };
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        const $tag = $('.govuk-tag');
        expect($tag.text().trim()).to.equal('Incomplete');
        expect($tag.attr('class')).to.contain('govuk-tag--blue');
    });

    it('supports additional statuses like inProgress', () => {
        statuses.inProgress = 'light-blue';
        locals.values = { taskOneStatus: 'inProgress' };
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        const $tag = $('.govuk-tag');
        expect($tag.text().trim()).to.equal('In progress');
        expect($tag.attr('class')).to.contain('govuk-tag--light-blue');
    });

    it('idPrefix is derived from fieldName', () => {
        const $ = renderTask({ tasks: [tasks[0]], statuses });
        expect($('.govuk-task-list__status').attr('id')).to.equal('taskList-1-status');
    });

    it('idPrefix defaults to task-list when no fieldName provided', () => {
        const $ = render.withLocale({ component: 'hmpoTaskList', params: { tasks: [tasks[0]], statuses }, ctx: true }, locals);
        expect($('.govuk-task-list__status').attr('id')).to.equal('task-list-1-status');
    });

    it('renders a section heading from fieldName label key', () => {
        const $ = renderTask({ tasks, statuses });
        expect($('h2').text().trim()).to.equal('Your application');
    });

    it('does not render a section heading when no fieldName is provided', () => {
        const $ = render.withLocale({ component: 'hmpoTaskList', params: { tasks, statuses }, ctx: true }, locals);
        expect($('h2').length).to.equal(0);
    });

    it('renders an empty task list when tasks is not provided', () => {
        const $ = renderTask({ statuses });
        expect($('.govuk-task-list__item').length).to.equal(0);
    });
});
