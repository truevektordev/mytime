define([
    "module", "dojo/_base/declare",
    "dojo/Stateful",
    "mytime/util/setIfDifferent"
],
function (module, declare, Stateful, setIfDifferent) {
    return declare(module.id, [Stateful], {
        id: null,
        code: null,
        name: null,
        color: null,

        constructor: function(values) {
            if (typeof values === 'object') {
                this.updateFrom(values, true);
            }
        },

        updateFrom: function(properties, ignoreEmptyProperties) {
            var copyEveryProperty = !ignoreEmptyProperties;
            _.forEach(["id", "code", "name"], function(property) {
                if (copyEveryProperty || properties.hasOwnProperty(property)) {
                    setIfDifferent(this, property, properties[property]);
                }
            }, this);
        }
    });
});