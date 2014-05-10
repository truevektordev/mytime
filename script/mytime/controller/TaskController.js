define([
    "dojo/_base/lang", "dojo/_base/declare",
    "dojox/mvc/sync",
    'mytime/model/modelRegistry', 'mytime/model/Task',
    "mytime/command/CreateTaskCommand", 'mytime/command/UpdateTaskCommand',
    'mytime/command/DeleteTaskCommand',
    'mytime/util/ColorGenerator',
    'mytime/persistence/IdGenerator'
], function(
    lang, declare,
    sync,
    modelRegistry, Task,
    CreateTaskCommand, UpdateTaskCommand, DeleteTaskCommand,
    ColorGenerator,
    IdGenerator
) {

    return declare(null, {

        _taskStore: null,

        colorGenerator: null,

        constructor: function() {
            this.colorGenerator = new ColorGenerator();
            sync(modelRegistry, 'taskStore', this, '_taskStore', {bindDirection: sync.from});
            CreateTaskCommand.subscribe(lang.hitch(this, 'handleCreateTask'));
            UpdateTaskCommand.subscribe(lang.hitch(this, 'handleUpdateTask'));
            DeleteTaskCommand.subscribe(lang.hitch(this, 'handleDeleteTask'));
        },

        handleCreateTask: function(command) {
            if (!this._taskStore) {
                command.reject(new Error("Cannot add task before system is initialized."));
            } else {
                var task = new Task(command.task);
                task.set('id', IdGenerator.nextIdForType('Task'));
                if (!task.get('color')) {
                    task.set('color', this.colorGenerator.next());
                }
                console.log('PUT NEW ' + JSON.stringify(task));
                this._taskStore.put(task);
                command.resolve({taskId: task.get('id'), task: task});
            }
        },

        handleUpdateTask: function(command) {
            if (!this._taskStore) {
                command.reject(new Error("Cannot update task before system is initialized."));
            } else {
                var existingEntry = this._taskStore.get(command.task.get('id'));
                if (!existingEntry) {
                    var error = new Error("Cannot update task. It does not exist.");
                    error.task = command.task;
                    error.taskId = command.task.get('id');
                    command.reject(error);
                    return;
                }
                existingEntry.updateFrom(command.task);
                console.log('PUT ' + JSON.stringify(existingEntry));
                this._taskStore.put(existingEntry);
                command.resolve({taskId: existingEntry.get('id'), task: existingEntry});
            }
        },

        handleDeleteTask: function(command) {
            if (!this._taskStore) {
                command.reject(new Error("Cannot delete task before system is initialized."));
            } else {
                var existingEntry = this._taskStore.get(command.taskId);
                if (!existingEntry) {
                    var error = new Error("Cannot delete task. It does not exist.");
                    error.taskId = command.taskId;
                    command.reject(error);
                    return;
                }
                console.log('REMOVE ' + JSON.stringify(existingEntry));
                this._taskStore.remove(command.taskId);
                command.resolve({taskId: command.taskId, task: existingEntry});
            }
        }

        // TODO destroy
    });

});