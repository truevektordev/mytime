define([
    "lodash",
    "dojo/_base/declare", "dojo/_base/lang", "dojo/Evented",
    "dijit/_WidgetBase",
    "mytime/model/TimeEntry",
    "mytime/command/AddTimeEntryCommand",
    "mytime/util/DateTimeUtil",
    "mytime/DailyTimeWidget/DailyTimeWidgetView"
],
function (_, declare, lang, Evented, _WidgetBase, TimeEntry, AddTimeEntryCommand, DateTimeUtil, View) {

    /**
     * inputs:
     * - timeEntryStore, date
     * emits:
     * - createEntryAction, updateEntryAction, deleteEntryAction
     */
    return declare([_WidgetBase, Evented], {

        date: null,

        startHour: 7,

        endHour: 19,

        timeEntryStore: null,

        _view: null,

        _queryResults: null,
        _timeEntryStoreObserverHandle: null,

        constructor: function() {
            this._view = new View();
        },

        _setTimeEntryStoreAttr: function(store) {
            this.timeEntryStore = store;
            this._view.timeEntryStore.set('sourceStore', store);
        },

        _setDateAttr: function(date) {
            this.date = date;
            this._view.timeEntryStore.set('date', date);
        },

        _setStartHourAttr: function(startHour) {
            this.startHour = startHour;
            this._view.timeEntryStore.set('startHour', startHour);
        },

        _setEndHourAttr: function(endHour) {
            this.endHour = endHour;
            this._view.timeEntryStore.set('endHour', endHour);
        },

        buildRendering: function() {
            this.domNode = this._view.domNode;
        },

        postCreate: function() {
            this.own(
                this._view.on("endDrag", lang.hitch(this, "_endDragListener"))
            );
        },

        _endDragListener: function(event) {
            var timeEntry = this._createTimeEntryFromDragEvent(event);

            if (timeEntry.startHour === timeEntry.endHour) {
                return; // The selected range is too small.
            }

            this.emit('createEntryAction', {
                timeEntry: timeEntry
            });
        },

        _createTimeEntryFromDragEvent: function(event) {
            var timeEntry = new TimeEntry({
                date: this.date,
                startHour: Math.min(event.startHour, event.endHour),
                endHour: Math.max(event.startHour, event.endHour)
            });

            timeEntry.startHour = DateTimeUtil.roundToFifteenMinutes(timeEntry.startHour);
            timeEntry.endHour = DateTimeUtil.roundToFifteenMinutes(timeEntry.endHour);

            return timeEntry;
        }

    });
});