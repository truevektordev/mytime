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
     * - createTimeEntry, updateTimeEntry, deleteTimeEntry
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
            var entryAtStartOfDrag = this._findEntryContainingHour(event.startHour);
            if (entryAtStartOfDrag) {
                var startOrEnd = this._isHourAtStartOrEndOfEntry(entryAtStartOfDrag, event.startHour);
                if (startOrEnd) {
                    this._doEndDragAdjust(event, entryAtStartOfDrag, startOrEnd);
                } else {
                    this._doEndDragMove(event, entryAtStartOfDrag);
                }
            } else {
                this._doEndDragCreate(event);
            }
        },

        _findEntryContainingHour: function(hour) {
            var result = null;
            _.forEach(this._internalStore.query({}), function(entry) {
                if (hour > entry.startHour && hour < entry.endHour) {
                    result = entry;
                    return false; //exit loop
                }
            });
            return result;
        },

        _isHourAtStartOrEndOfEntry: function(timeEntry, hour) {
            if (hour < timeEntry.startHour + 0.083) {
                return 'start';
            } else if (hour > timeEntry.endHour - 0.083) {
                return 'end';
            } else {
                return false;
            }
        },

        _doEndDragCreate: function(event) {
            var timeEntry = this._createTimeEntryFromDragEvent(event);

            if (timeEntry.startHour === timeEntry.endHour) {
                return; // The selected range is too small.
            }

            this.emit('createTimeEntry', {
                timeEntry: timeEntry
            });
        },

        _doEndDragAdjust: function(event, timeEntry, startOrEnd) {
            timeEntry = this.timeEntryStore.get(timeEntry.id);
            var modifiedTimeEntry = new TimeEntry({
                id: timeEntry.get('id'),
                startHour: timeEntry.get('startHour'),
                endHour: timeEntry.get('endHour')
            });

            var destinationHour = DateTimeUtil.roundToFifteenMinutes(event.endHour);
            var propertyToModify = startOrEnd + 'Hour';
            if (destinationHour === timeEntry.get(propertyToModify)) {
                return; // Didn't change significantly.
            }
            modifiedTimeEntry.set(propertyToModify, destinationHour);
            if (modifiedTimeEntry.get('startHour') === modifiedTimeEntry.get('endHour')) {
                // adjusted to zero time... Just delete it.
                this.emit('deleteTimeEntry', {
                    timeEntryId: modifiedTimeEntry.get('id')
                });
            } else {
                this.emit('updateTimeEntry', {
                    timeEntry: modifiedTimeEntry
                });
            }
        },

        _doEndDragMove: function(event, timeEntry) {
            var diff = event.endHour - event.startHour;
            diff = DateTimeUtil.roundToFifteenMinutes(diff);
            if (diff === 0) {
                return; // Didn't change significantly.
            }

            timeEntry = this.timeEntryStore.get(timeEntry.id);
            var modifiedTimeEntry = new TimeEntry({
                id: timeEntry.get('id'),
                startHour: timeEntry.get('startHour') + diff,
                endHour: timeEntry.get('endHour') + diff
            });

            this.emit('updateTimeEntry', {
                timeEntry: modifiedTimeEntry
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