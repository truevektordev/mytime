define(["lodash", "dojo/_base/declare", "dojo/Deferred", "dojo/topic"],
function (_, declare, Deferred, topic) {

    var _Command = declare([Deferred], {
        commandTopic: "",

        exec: function() {
            topic.publish("command/" + this.commandTopic, this);
            return this;
        },

        subscribe: function(subscriberFunction) {
            topic.subscribe("command/" + this.commandTopic, subscriberFunction);
        }
    });

    return _Command;
});