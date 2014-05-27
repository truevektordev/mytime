define([
    "dojo/_base/lang", "dojo/_base/declare",
    "dijit/Destroyable",
    "mytime/persistence/IdGenerator"
], function(
    lang, declare,
    Destroyable,
    IdGenerator
) {

    return declare([Destroyable], {

        createCommand: null,
        updateCommand: null,
        deleteCommand: null,

        store: null,
        objectTypeConstructor: null,
        objectTypeName: "",
        objectTypeStringForMessages: "",

        commandObjectProperty: "",
        commandIdProperty: "",

        constructor: function() {
            this.own(
                this.createCommand.subscribe(lang.hitch(this, "handleCreate")),
                this.updateCommand.subscribe(lang.hitch(this, "handleUpdate")),
                this.deleteCommand.subscribe(lang.hitch(this, "handleDelete"))
            );
        },

        handleCreate: function(command) {
            if (!this.store) {
                command.reject(this._getCommandError("Cannot add {} before system is initialized."));
            } else {
                var entry = new this.objectTypeConstructor(command[this.commandObjectProperty]);
                entry.set("id", IdGenerator.nextIdForType(this.objectTypeName));
                console.log("PUT NEW " + JSON.stringify(entry));
                this.store.put(entry);
                command.resolve(this._getCommandResult(entry));
            }
        },

        handleUpdate: function(command) {
            if (!this.store) {
                command.reject(this._getCommandError("Cannot update {} before system is initialized."));
            } else {
                var updateObject = command[this.commandObjectProperty];
                var id = updateObject.id;
                var existingEntry = this.store.get(id);
                if (!existingEntry) {
                    command.reject(this._getCommandError("Cannot update {}. It does not exist."));
                    return;
                }
                existingEntry.updateFrom(updateObject);
                console.log("PUT " + JSON.stringify(existingEntry));
                this.store.put(existingEntry);
                command.resolve(this._getCommandResult(existingEntry));
            }
        },

        handleDelete: function(command) {
            if (!this.store) {
                command.reject(this._getCommandError("Cannot delete {} before system is initialized."));
            } else {
                var id = command[this.commandIdProperty];
                var existingEntry = this.store.get(id);
                if (!existingEntry) {
                    command.reject(this._getCommandError("Cannot delete {}. It does not exist."));
                    return;
                }
                console.log("REMOVE " + JSON.stringify(existingEntry));
                this.store.remove(id);
                command.resolve(this._getCommandResult(existingEntry, id));
            }
        },

        _getCommandResult: function(object, id) {
            var result = {};
            if (object) {
                id = id || object.id;
                result[this.commandObjectProperty] = object;
            }
            if (id) {
                result[this.commandIdProperty] = id;
            }
            return result;
        },

        _getCommandError: function(errorString) {
            return new Error(errorString.replace(/{}/g, this.objectTypeStringForMessages));
        }

        // TODO destroy
    });

});