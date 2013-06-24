describe("commands", function() {

    var topic = demand("dojo/topic");
    var AddTimeEntryCommand = demand("mytime/command/AddTimeEntryCommand");
    var RemoveTimeEntryCommand = demand("mytime/command/RemoveTimeEntryCommand");
    var UpdateTimeEntryCommand = demand("mytime/command/UpdateTimeEntryCommand");

    var TimeEntry = demand("mytime/model/TimeEntry");

    var handle;
    var topicSpy, callbackSpy;

    afterEach(function() {
        if (handle) handle.remove();
    });

    it("AddTimeEntryCommand", function() {
        handle = topic.subscribe("command/time-entry/add", topicSpy = jasmine.createSpy());
        var command = new AddTimeEntryCommand();
        command.timeEntry = new TimeEntry({id: "a"});
        command.then(callbackSpy = jasmine.createSpy());
        command.exec();
        expect(topicSpy).toHaveBeenCalledWith(command);
        command.resolve("abc");
        expect(callbackSpy).toHaveBeenCalledWith("abc");
    });

});