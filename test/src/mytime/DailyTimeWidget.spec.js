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
        store.put(timeEntry);
        widget._handleTimeEntryAdded(timeEntry);
    }

    function remove(timeEntry) {
        if (typeof timeEntry === "string") {
            timeEntry = createTimeEntry.apply(this, arguments);
        }
        store.remove(timeEntry);
        widget._handleTimeEntryRemoved(timeEntry);
    }

    function update(id, date, startHour, endHour, color) {
        var entry = store.get(id);
        if (date != null) entry.set("date", date);
        if (startHour != null) entry.set("startHour", startHour);
        if (endHour != null) entry.set("endHour", endHour);
        if (color != null) entry.set("color", color);
        widget._handleTimeEntryModified(entry);
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

    it("ignores items outside of bounds", function() {
        createBasicWidget();
        add(createTimeEntry("a", "2010-10-10", 2, 8));
        add(createTimeEntry("b", "2010-10-10", 8, 10));
        add(createTimeEntry("c", "2010-10-10", 16, 18));
        add(createTimeEntry("d", "2010-10-10", 18, 24));
        expectDisplayed();
    });

    it("ignores items with wrong date", function() {
        createBasicWidget();
        add(createTimeEntry("a", "2010-10-9", 10, 12.5));
        add(createTimeEntry("b", "2010-10-11", 12, 13));
        add(createTimeEntry("c", "2014-10-10", 13.25, 17));
        expectDisplayed();
    });

    it("removes items", function() {
        createBasicWidget();
        add("beginning", "2010-10-10", 10, 12.5);
        add("middle", "2010-10-10", 12, 13);
        add("end", "2010-10-10", 13.25, 17);
        add("remains", "2010-10-10", 13, 14);

        remove("beginning", "2010-10-10", 10, 12.5);
        remove("middle", "2010-10-10", 12, 13);
        remove("end", "2010-10-10", 13.25, 17);
        expectDisplayed(["remains", 13, 14]);
    });

    it("modifies a moved entry", function() {
        createBasicWidget();
        add("a", "2010-10-10", 10, 12.5);
        update("a", null, 11);
        expectDisplayed(["a", 11, 12.5]);
        update("a", null, null, 11.5);
        expectDisplayed(["a", 11, 11.5]);
    });

    it("modifies a moved entry and constrains to bounds", function() {
        createBasicWidget();
        add("a", "2010-10-10", 10, 12.5);
        update("a", null, 3);
        expectDisplayed(["a", 10, 12.5]);
        update("a", null, null, 20);
        expectDisplayed(["a", 10, 16]);
    });

    it("adds item when moves into range", function() {
        createBasicWidget();
        add("wrong-hour", "2010-10-10", 2, 3);
        add("wrong-day", "2010-10-9", 10, 12.5);

        update("wrong-hour", null, 11, 14);
        update("wrong-day", "2010-10-10");

        expectDisplayed(["wrong-hour", 11, 14],
                        ["wrong-day", 10, 12.5]);
    });

    it("removes item when moves out of range", function() {
        createBasicWidget();
        add("wrong-hour", "2010-10-10", 12, 33);
        add("wrong-day", "2010-10-10", 10, 12.5);

        update("wrong-hour", null, 3, 4);
        update("wrong-day", "2010-10-11");

        expectDisplayed();
    });


});