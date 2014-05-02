define([
    "dojo/_base/lang", "dojo/_base/declare",
    "dojox/mvc/sync",
    'mytime/model/modelRegistry', 'mytime/command/AddTimeEntryCommand', 'mytime/persistence/IdGenerator'
], function(
    lang, declare,
    sync,
    modelRegistry, AddTimeEntryCommand, IdGenerator
) {

    return declare(null, {

        _timeEntryStore: null,

        constructor: function() {
            sync(modelRegistry, 'timeEntryStore', this, '_timeEntryStore', {bindDirection: sync.from});
            AddTimeEntryCommand.subscribe(lang.hitch(this, 'handleAddTimeEntry'));
        },

        handleAddTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot add time entry before system is initialized."));
            } else {
                command.timeEntry.set('id', IdGenerator.nextIdForType('TimeEntry'));
                console.log('PUT ' + JSON.stringify(command.timeEntry));
                this._timeEntryStore.put(command.timeEntry);
            }
        }

        // TODO destroy
    });

});