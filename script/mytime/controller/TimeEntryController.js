define([
    "dojo/_base/lang", "dojo/_base/declare",
    "mytime/model/modelRegistry", "mytime/model/TimeEntry",
    "mytime/command/CreateTimeEntryCommand", "mytime/command/UpdateTimeEntryCommand",
    "mytime/command/DeleteTimeEntryCommand",
    "mytime/controller/_CrudController",
    "mytime/util/syncFrom"
], function(
    lang, declare,
    modelRegistry, TimeEntry,
    CreateTimeEntryCommand, UpdateTimeEntryCommand, DeleteTimeEntryCommand,
    _CrudController,
    syncFrom
) {

    return declare([_CrudController], {

        createCommand: CreateTimeEntryCommand,
        updateCommand: UpdateTimeEntryCommand,
        deleteCommand: DeleteTimeEntryCommand,

        commandObjectProperty: "timeEntry",
        commandIdProperty: "timeEntryId",

        objectTypeConstructor: TimeEntry,
        objectTypeName: "TimeEntry",
        objectTypeStringForMessages: "time entry",

        constructor: function() {
            this.own( syncFrom(modelRegistry, "timeEntryStore", this, "store") );
        }
    });

});