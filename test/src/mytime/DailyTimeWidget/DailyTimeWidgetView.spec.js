describe("mytime/DailyTimeWidget/DailyTimeWidgetView", function() {

    var View = demand("mytime/DailyTimeWidget/DailyTimeWidgetView");
    var TimeEntry = demand("mytime/model/TimeEntry");
    var query = demand("dojo/query");
    var domClass = demand("dojo/dom-class");
    var domStyle = demand("dojo/dom-style");

    var view;

    function createBasicView() {
        view = new View({startHour: 8, endHour: 14});
    }

    function addTimeEntry(id, startHour, endHour, color) {
        if (!color) {
            color = "blue";
        }
        view.timeEntryStore.put(new TimeEntry({
            id: id,
            startHour: startHour,
            endHour: endHour,
            color: color
        }));
    }

    function changeTimeEntry(id, startHour, endHour, color) {
        var timeEntry = view.timeEntryStore.get(id);
        if (startHour != null) {
            timeEntry.set("startHour", startHour);
        }
        if (endHour != null) {
            timeEntry.set("endHour", endHour);
        }
        if (color != null) {
            timeEntry.set("color", color);
        }
    }

    function removeTimeEntry(id) {
        view.timeEntryStore.remove(id);
    }

    function getBars(expectedNumberOfBars) {
        var bars = query(".time-bar", view.domNode);
        expect(bars.length).toBe(expectedNumberOfBars);
        return bars.length == 1 ? bars[0] : bars;
    }

    function getBar() {
        return getBars(1);
    }

    function expectClasses(domNode, classes) {
        var actual = domNode.className.split(/\s+/).sort().join(" ");
        var expected = classes.split(/\s+/).sort().join(" ");
        expect(actual).toBe(expected);
    }

    function expectPosition(bar, row, leftPercent, rightPercent, isStart, isEnd) {
        expect(bar.parentNode.cellIndex).toBe(1);
        expect(bar.parentNode.parentNode.rowIndex).toBe(row);
        leftPercent = leftPercent + "%";
        rightPercent = rightPercent + "%";
        expect(bar.style.left).toBe(leftPercent);
        expect(bar.style.right).toBe(rightPercent);
        expect(domClass.contains(bar, "start")).toBe(isStart);
        expect(domClass.contains(bar, "end")).toBe(isEnd);
    }

    it("starts out empty", function() {
        createBasicView();
        var table = query("table", view.domNode)[0];
        expect(table.rows.length).toBe(8);
        expect(table.rows[1].cells.length).toBe(2);
        expect(query(".time-bar").length).toBe(0);
    });

    it("renders a time bar that spans exactly one hour", function() {
        createBasicView();
        addTimeEntry("a", 9, 10, "blue");
        var bar = getBar();
        expectPosition(bar, 2, 0, 0, true, true);
    });

    it("renders a time bar that spans first half hour", function() {
        createBasicView();
        addTimeEntry("a", 9, 9.5, "blue");
        var bar = getBar();
        expectPosition(bar, 2, 0, 50, true, true);
    });

    it("renders a time bar that spans middle half hour", function() {
        createBasicView();
        addTimeEntry("a", 9.25, 9.75, "blue");
        var bar = getBar();
        expectPosition(bar, 2, 25, 25, true, true);
    });

    it("renders a two hour chunk", function() {
        createBasicView();
        addTimeEntry("a", 8, 10, "blue");
        var bars = getBars(2);
        expectPosition(bars[0], 1, 0, 0, true, false);
        expectPosition(bars[1], 2, 0, 0, false, true);
    });

    it("renders a three hour chunk", function() {
        createBasicView();
        addTimeEntry("a", 8, 11, "blue");
        var bars = getBars(3);
        expectPosition(bars[0], 1, 0, 0, true, false);
        expectPosition(bars[1], 2, 0, 0, false, false);
        expectPosition(bars[2], 3, 0, 0, false, true);
    });

    it("renders a chunk, straddling three hours", function() {
        createBasicView();
        addTimeEntry("a", 8.75, 10.25, "blue");
        var bars = getBars(3);
        expectPosition(bars[0], 1, 75, 0, true, false);
        expectPosition(bars[1], 2, 0, 0, false, false);
        expectPosition(bars[2], 3, 0, 75, false, true);
    });

    it("changes start time within hour", function() {
        createBasicView();
        addTimeEntry("a", 9, 10, "blue");

        changeTimeEntry("a", 9.25);
        expectPosition(getBar(), 2, 25, 0, true, true);

        changeTimeEntry("a", 9);
        expectPosition(getBar(), 2, 0, 0, true, true);
    });

    it("changes end time within hour", function() {
        createBasicView();
        addTimeEntry("a", 9, 10, "blue");

        changeTimeEntry("a", null, 9.5);
        expectPosition(getBar(), 2, 0, 50, true, true);

        changeTimeEntry("a", null, 9.75);
        expectPosition(getBar(), 2, 0, 25, true, true);
    });

    it("adds hours to end", function() {
        createBasicView();
        addTimeEntry("a", 9, 10, "blue");

        changeTimeEntry("a", null, 10.5);
        var bars = getBars(2)
        expectPosition(bars[0], 2, 0, 0, true, false);
        expectPosition(bars[1], 3, 0, 50, false, true);

        changeTimeEntry("a", null, 12);
        var bars = getBars(3)
        expectPosition(bars[0], 2, 0, 0, true, false);
        expectPosition(bars[1], 3, 0, 0, false, false);
        expectPosition(bars[2], 4, 0, 0, false, true);
    });

    it("adds hours to beginning", function() {
        createBasicView();
        addTimeEntry("a", 10, 10.5, "blue");

        changeTimeEntry("a", 9);
        var bars = getBars(2)
        expectPosition(bars[0], 2, 0, 0, true, false);
        expectPosition(bars[1], 3, 0, 50, false, true);

        changeTimeEntry("a", 8.75);
        var bars = getBars(3)
        expectPosition(bars[0], 1, 75, 0, true, false);
        expectPosition(bars[1], 2, 0, 0, false, false);
        expectPosition(bars[2], 3, 0, 50, false, true);
    });

    it("remove hours from end", function() {
        createBasicView();
        addTimeEntry("a", 9, 12, "blue");

        changeTimeEntry("a", null, 10.5);
        var bars = getBars(2)
        expectPosition(bars[0], 2, 0, 0, true, false);
        expectPosition(bars[1], 3, 0, 50, false, true);

        changeTimeEntry("a", null, 10);
        expectPosition(getBar(), 2, 0, 0, true, true);
    });

    it("remove hours from beginning", function() {
        createBasicView();
        addTimeEntry("a", 8.75, 10.5, "blue");

        changeTimeEntry("a", 9);
        var bars = getBars(2)
        expectPosition(bars[0], 2, 0, 0, true, false);
        expectPosition(bars[1], 3, 0, 50, false, true);

        changeTimeEntry("a", 10.25);
        expectPosition(getBar(), 3, 25, 50, true, true);
    });

});