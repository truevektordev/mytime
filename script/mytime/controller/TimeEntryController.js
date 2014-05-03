define([
    "dojo/_base/lang", "dojo/_base/declare",
    "dojox/mvc/sync",
    'mytime/model/modelRegistry', 'mytime/command/AddTimeEntryCommand', 'mytime/command/UpdateTimeEntryCommand',
    'mytime/persistence/IdGenerator'
], function(
    lang, declare,
    sync,
    modelRegistry, AddTimeEntryCommand, UpdateTimeEntryCommand,
    IdGenerator
) {

    return declare(null, {

        _timeEntryStore: null,

        constructor: function() {
            sync(modelRegistry, 'timeEntryStore', this, '_timeEntryStore', {bindDirection: sync.from});
            AddTimeEntryCommand.subscribe(lang.hitch(this, 'handleAddTimeEntry'));
            UpdateTimeEntryCommand.subscribe(lang.hitch(this, 'handleUpdateTimeEntry'));
        },

        handleAddTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot add time entry before system is initialized."));
            } else {
                command.timeEntry.set('id', IdGenerator.nextIdForType('TimeEntry'));
                console.log('PUT ' + JSON.stringify(command.timeEntry));
                this._timeEntryStore.put(command.timeEntry);
            }
        },

        handleUpdateTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot add time entry before system is initialized."));
            } else {
                var existingEntry = this._timeEntryStore.get(command.timeEntry.get('id'));
                this._copyTimeEntryProperties(command.timeEntry, existingEntry);
                console.log('PUT ' + JSON.stringify(existingEntry));
                this._timeEntryStore.put(existingEntry);
            }
        },

        _copyTimeEntryProperties: function(source, dest) {
            _.forEach(['date', 'startHour', 'endHour'], function(property) {
                if (source.hasOwnProperty(property)) {
                    dest.set(property, source.get(property));
                }
            });
        }

        // TODO destroy
    });

});