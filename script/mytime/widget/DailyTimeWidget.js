define([
    "lodash",
    "dojo/_base/lang", "dojo/_base/declare", "dojo/Evented", "dojo/store/Observable",
    "dijit/_WidgetBase",
    "mytime/model/TimeEntry",
    "mytime/util/DateTimeUtil", "mytime/util/SingleDayFilteringTimeEntryStore", "mytime/util/syncFrom",
    "mytime/widget/DailyTimeWidget/DailyTimeWidgetView"
],
function (
    _, lang, declare, Evented, Observable,
    _WidgetBase,
    TimeEntry,
    DateTimeUtil, SingleDayFilteringTimeEntryStore, syncFrom,
    View) {

    /**
     * inputs:
     * - timeEntryStore, date
     * emits:
     * - createEntryAction, updateEntryAction, deleteEntryAction
     */
    return declare([_WidgetBase, Evented], {

        /**
         * @type {string} yyyy-mm-dd
         */
        date: null,

        startHour: 7,

        endHour: 19,

        timeEntryStore: null,
        
        _internalStore: null,

        _view: null,

        _queryResults: null,
        _timeEntryStoreObserverHandle: null,

        constructor: function() {
            this._internalStore = new Observable(new SingleDayFilteringTimeEntryStore());
            this.own(
                syncFrom(this, 'date', this._internalStore),
                syncFrom(this, 'startHour', this._internalStore),
                syncFrom(this, 'endHour', this._internalStore),
                syncFrom(this, 'timeEntryStore', this._internalStore, 'sourceStore')
            );
            this._view = new View({
                model: this
            });
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