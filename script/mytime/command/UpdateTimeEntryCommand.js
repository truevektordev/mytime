define(["dojo/_base/declare", "./_Command"],
function (declare, _Command) {
    return declare([_Command], {
        commandTopic: "time-entry/update",
        timeEntry: null
    });
});