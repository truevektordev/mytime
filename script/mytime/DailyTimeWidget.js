define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "mytime/model/TimeEntry",
    "mytime/util/setIfDifferent",
    "mytime/DailyTimeWidget/DailyTimeWidgetView"
],
function (declare, _WidgetBase, TimeEntry, setIfDifferent, View) {

    return declare([_WidgetBase], {

        date: null,

        startHour: 7,

        endHour: 19,

        timeEntryStore: null,

        _view: null,

        buildRendering: function() {
            this._view = new View();
            this.domNode = this._view.domNode;
        },

        _handleTimeEntryAdded: function(timeEntry) {
            if (!this._isInThisWidgetsRange(timeEntry)) {
                return;
            }

            var clonedEntry = new TimeEntry({
                id: timeEntry.id,
                startHour: this._constrainStartHour(timeEntry.startHour),
                endHour: this._constrainEndHour(timeEntry.endHour),
                color: "blue"
            });

            this._view.timeEntryStore.put(clonedEntry);
        },

        _isInThisWidgetsRange: function(timeEntry) {
            return timeEntry.date === this.date
                && timeEntry.startHour < this.endHour + 1
                && timeEntry.endHour > this.startHour;
        },

        _handleTimeEntryRemoved: function(timeEntry) {
            if (this._view.timeEntryStore.get(timeEntry.id)) {
                this._view.timeEntryStore.remove(timeEntry.id);
            }
        },

        _handleTimeEntryModified: function(timeEntry) {
            var internal = this._view.timeEntryStore.get(timeEntry.id);
            if (!internal) {
                this._handleTimeEntryAdded(timeEntry);
                return;
            }
            if (!this._isInThisWidgetsRange(timeEntry)) {
                this._handleTimeEntryRemoved(timeEntry);
                return;
            }

            this._handleChangesToTimeEntry(internal, timeEntry);
        },

        _handleChangesToTimeEntry: function(internalTimeEntry, timeEntry) {
            var startHour = this._constrainStartHour(timeEntry.startHour);
            var endHour = this._constrainEndHour(timeEntry.endHour);
            setIfDifferent(internalTimeEntry, "startHour", startHour);
            setIfDifferent(internalTimeEntry, "endHour", endHour);
        },

        _constrainStartHour: function(startHour) {
            return Math.max(startHour, this.startHour);
        },

        _constrainEndHour: function(endHour) {
            return Math.min(endHour, this.endHour + 1);
        }

    });
});