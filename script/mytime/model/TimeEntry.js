define([
    "module", "dojo/_base/declare",
    "dojo/Stateful",
    "mytime/util/setIfDifferent"
],
function (module, declare, Stateful, setIfDifferent) {
    return declare(module.id, [Stateful], {
        id: null,
        date: null,
        startHour: null,
        endHour: null,

        text: null,
        taskId: null,

        constructor: function(values) {
            if (typeof values === 'object') {
                this.updateFrom(values, true);
            }
        },

        updateFrom: function(properties, ignoreEmptyProperties) {
            var copyEveryProperty = !ignoreEmptyProperties;
            _.forEach(["id", "date", "startHour", "endHour", "text", "taskId"], function(property) {
                if (copyEveryProperty || properties.hasOwnProperty(property)) {
                    setIfDifferent(this, property, properties[property]);
                }
            }, this);
        }
    });
});