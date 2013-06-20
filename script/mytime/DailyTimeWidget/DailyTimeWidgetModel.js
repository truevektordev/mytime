define(['dojo/_base/declare', 'dojo/Stateful'],
function (declare, Stateful) {
    return declare([Stateful], {
        timeEntryStore: null,
        startHour: 7,
        endHour: 19,

        constructor: function() {
            this.timeEntryStore= new Observable(new MemoryStore());
        }
    });
});