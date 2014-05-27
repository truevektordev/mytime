define([
    "lodash", "dojo/_base/lang", "dojo/_base/declare",
    "dijit/form/ComboBox",
    "mytime/command/CreateTaskCommand",
    "mytime/util/Colors"
],
function (
    _, lang, declare,
    ComboBox,
    CreateTaskCommand,
    Colors
) {
    return declare([ComboBox], {

        searchAttr: "code",

        labelType: "html",

        constructor: function() {
            this.baseClass += " taskpicker";
        },

        _getTaskAttr: function() {
            return this.get("item");
        },

        _setTaskAttr: function(task) {
            this.set("item", task);
        },

        _handleOnChange: function(newStringValue) {
            this.inherited(arguments);
            if (!this.item && newStringValue) {
                var task = this._parseStringToTask(newStringValue);
                if (task) {
                    new CreateTaskCommand({task: task}).exec().then(lang.hitch(this, function(result) {
                        this.set("task", result.task);
                    }));
                }
            }
        },

        _isValidCode: function(code) {
            return code && code.length > 1;
        },

        _parseStringToTask: function(string) {
            string = string.trim();
            if (string.length === 0) {
                return null;
            }

            var task = {
                code: string
            };
            var firstSpace = string.indexOf(' ');
            if (firstSpace > -1) {
                task.code = string.substring(0, firstSpace);
                task.name = string.substring(firstSpace + 1).trim();
                if (task.name.length < 1) {
                    delete task.name;
                }
            }
            return task;
        },

        labelFunc: function(item, store) {
            return '<span class="task" style="color: ' + Colors.dark(item.color) + '"><span class="code">' + item.code + '</span> <span class="name">' + (item.name || "") + '</span></span>';
        },

        focusAndSelectAll: function() {
            this.focus();
            this.focusNode.select();
        }
    });
});