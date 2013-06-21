describe("mytime/DailyTimeWidget", function() {

    var DailyTimeWidget = demand("mytime/DailyTimeWidget");
    var TimeEntry = demand("mytime/model/TimeEntry");
    var MemoryStore = demand("dojo/store/Memory");
    var Observable = demand("dojo/store/Observable");

    var widget, store, internalStore;

    function createBasicWidget() {
        store = new Observable(new MemoryStore());
        widget = new DailyTimeWidget({date: "2010-10-10", startHour: 10, endHour: 15, timeEntryStore: store});
        internalStore = widget._view.timeEntryStore;
    }

    function createTimeEntry(id, date, startHour, endHour, color) {
        return new TimeEntry({
            id: id,
            date: date,
            startHour: startHour,
            endHour: endHour,
            color: color
        });
    }

    function add(timeEntry) {
        if (typeof timeEntry === "string") {
            timeEntry = createTimeEntry.apply(this, arguments);
        }
        widget._handleTimeEntryAdded(timeEntry);
    }

    function remove(timeEntry) {
        if (typeof timeEntry === "string") {
            timeEntry = createTimeEntry.apply(this, arguments);
        }
        widget._handleTimeEntryRemoved(timeEntry);
    }

    function expectDisplayed() {
        expect(internalStore.query().length).toBe(arguments.length);

        for(var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            arg = {
                id: arg[0],
                startHour: arg[1],
                endHour: arg[2],
                color: arg[3] || "blue"
            };

            var actual = internalStore.get(arg.id);
            expect(actual).toBeDefined();
            if (actual) {
                expect(actual.startHour).toEqual(arg.startHour);
                expect(actual.endHour).toEqual(arg.endHour);
                expect(actual.color).toEqual(arg.color);
            }
        }
    }

    it("starts out empty", function() {
        createBasicWidget();
        expectDisplayed();
    });

    it("displays an entry in the middle", function() {
        createBasicWidget();
        add(createTimeEntry("a", "2010-10-10", 12, 14));
        expectDisplayed(["a", 12, 14]);
    });

    it("displays an entry at the beginning and end", function() {
        createBasicWidget();
        add(createTimeEntry("a", "2010-10-10", 10, 12.5));
        add(createTimeEntry("b", "2010-10-10", 13.25, 16));
        expectDisplayed(["a", 10, 12.5],
                        ["b", 13.25, 16]);
    });

    it("clips overflowing entries within bounds", function() {
        createBasicWidget();
        add(createTimeEntry("a", "2010-10-10", 9, 12.5));
        add(createTimeEntry("b", "2010-10-10", 13.25, 16.25));
        expectDisplayed(["a", 10, 12.5],
                        ["b", 13.25, 16]);
    });

    // TODO out of bounds
    // TODO remove
    // TODO modify

});