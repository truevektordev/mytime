define(["dojo/_base/declare", "./_Command"],
function (declare, _Command) {
    return _Command.makeCommand({
        commandTopic: "time-entry/update",
        timeEntry: null
    });
});