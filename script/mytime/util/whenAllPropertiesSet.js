define([
    "lodash"
], function(
    _
) {
    return function(object, properties, callback) {
        // remove properties that are already set
        properties = _.filter(properties, function(property) {
            return !object.get(property);
        });

        if (properties.length === 0) {
            callback();
            return;
        }

        var handle = object.watch(function(property, oldValue, value) {
            if (value) {
                var i = _.indexOf(properties, property);
                if (i !== -1) {
                    properties.splice(i, 1);
                    if (properties.length === 0) {
                        handle.remove();
                        callback();
                    }
                }
            }
        });

        return handle;
    };
});