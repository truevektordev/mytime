define([
    "module", "dojo/_base/declare",
    "dojo/Stateful"
],
function (module, declare, Stateful) {
    return declare(module.id, [Stateful], {
        id: null,
        date: null,
        startHour: null,
        endHour: null,

        text: null
    });
});