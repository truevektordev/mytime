define([
    'mytime/command/CreateTaskCommand'
], function(CreateTaskCommand) {
    return function() {
        new CreateTaskCommand({ task: { code: 'CAYENNE-1234', name: 'Squash a Bug' } }).exec();
        new CreateTaskCommand({ task: { code: 'CAYENNE-456', name: 'Make it Work' } }).exec();
        new CreateTaskCommand({ task: { code: 'CAYENNE-789', name: 'Do Something Awesome' } }).exec();
        new CreateTaskCommand({ task: { code: 'PSP-100', name: 'Uh Oh...' } }).exec();
    };
});