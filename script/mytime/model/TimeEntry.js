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

        updateFrom: function(properties, ignoreEmptyProperties) {
            _.forEach(["id", "date", "startHour", "endHour", "text"], function(property) {
                if (!ignoreEmptyProperties || properties[property] != null) {
                    setIfDifferent(this, property, properties[property]);
                }
            });
        }
    });
});