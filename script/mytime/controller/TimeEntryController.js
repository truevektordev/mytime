define([
    "dojo/_base/lang", "dojo/_base/declare",
    "dojox/mvc/sync",
    'mytime/model/modelRegistry', "mytime/command/CreateTimeEntryCommand", 'mytime/command/UpdateTimeEntryCommand',
    'mytime/command/DeleteTimeEntryCommand',
    'mytime/persistence/IdGenerator'
], function(
    lang, declare,
    sync,
    modelRegistry, CreateTimeEntryCommand, UpdateTimeEntryCommand, DeleteTimeEntryCommand,
    IdGenerator
) {

    return declare(null, {

        _timeEntryStore: null,

        constructor: function() {
            sync(modelRegistry, 'timeEntryStore', this, '_timeEntryStore', {bindDirection: sync.from});
            CreateTimeEntryCommand.subscribe(lang.hitch(this, 'handleCreateTimeEntry'));
            UpdateTimeEntryCommand.subscribe(lang.hitch(this, 'handleUpdateTimeEntry'));
            DeleteTimeEntryCommand.subscribe(lang.hitch(this, 'handleDeleteTimeEntry'));
        },

        handleCreateTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot add time entry before system is initialized."));
            } else {
                command.timeEntry.set('id', IdGenerator.nextIdForType('TimeEntry'));
                console.log('PUT NEW ' + JSON.stringify(command.timeEntry));
                this._timeEntryStore.put(command.timeEntry);
                command.resolve({timeEntryId: command.timeEntry.get('id'), timeEntry: command.timeEntry});
            }
        },

        handleUpdateTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot update time entry before system is initialized."));
            } else {
                var existingEntry = this._timeEntryStore.get(command.timeEntry.get('id'));
                if (!existingEntry) {
                    var error = new Error("Cannot update time entry. It does not exist.");
                    error.timeEntry = command.timeEntry;
                    error.timeEntryId = command.timeEntry.get('id');
                    command.reject(error);
                    return;
                }
                this._copyTimeEntryProperties(command.timeEntry, existingEntry);
                console.log('PUT ' + JSON.stringify(existingEntry));
                this._timeEntryStore.put(existingEntry);
                command.resolve({timeEntryId: existingEntry.get('id'), timeEntry: existingEntry});
            }
        },

        handleDeleteTimeEntry: function(command) {
            if (!this._timeEntryStore) {
                command.reject(new Error("Cannot delete time entry before system is initialized."));
            } else {
                var existingEntry = this._timeEntryStore.get(command.timeEntryId);
                if (!existingEntry) {
                    var error = new Error("Cannot delete time entry. It does not exist.");
                    error.timeEntryId = command.timeEntryId;
                    command.reject(error);
                    return;
                }
                console.log('REMOVE ' + JSON.stringify(existingEntry));
                this._timeEntryStore.remove(command.timeEntryId);
                command.resolve({timeEntryId: command.timeEntryId, timeEntry: existingEntry});
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