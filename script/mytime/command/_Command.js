define(["lodash", "dojo/_base/declare", "dojo/Deferred", "dojo/topic"],
function (_, declare, Deferred, topic) {

    var _Command = declare([Deferred], {
        commandTopic: "",

        exec: function() {
            topic.publish("command/" + this.commandTopic, this);
        }
    });

    return _Command;
});