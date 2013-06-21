define([], function () {
    return function(stateful, property, value) {
        if (stateful.get(property) !== value) {
            stateful.set(property, value);
        }
    }
});