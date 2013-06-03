define(['module', 'dojo/_base/declare', 'dojo/Stateful'],
function (module, declare, Stateful) {
    return declare([Stateful], {
        date: new Date(),
        timeslots: [],
        highlightedTimeSlot: null
    });
});