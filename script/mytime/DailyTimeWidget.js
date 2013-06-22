define([
    "lodash",
    "dojo/_base/declare", "dojo/_base/lang",
    "dijit/_WidgetBase",
    "mytime/model/TimeEntry",
    "mytime/util/setIfDifferent",
    "mytime/DailyTimeWidget/DailyTimeWidgetView"
],
function (_, declare, lang, _WidgetBase, TimeEntry, setIfDifferent, View) {

    return declare([_WidgetBase], {

        date: null,

        startHour: 7,

        endHour: 19,

        timeEntryStore: null,

        _view: null,

        _queryResults: null,
        _timeEntryStoreObserverHandle: null,

        _setTimeEntryStoreAttr: function(store) {
            if (store !== this.timeEntryStore || !this._isStoreRegistered()) {
                this.timeEntryStore = store;
                if (this.date) {
                    this._registerStore(store);
                }
            }
        },

        _setDateAttr: function(date) {
            if (date !== this.date) {
                this.date = date;
                if (this.timeEntryStore) {
                    // re-register the store with the new date for the query.
                    this._registerStore(this.timeEntryStore);
                }
            }
        },

        _setStartHourAttr: function(startHour) {
            if (startHour !== this.startHour) {
                this.startHour = startHour;
                this._view.startHour = startHour;
                this._refreshView();
            }
        },

        _setEndHourAttr: function(endHour) {
            if (endHour !== this.endHour) {
                this.endHour = endHour;
                this._view.endHour = endHour;
                this._refreshView();
            }
        },

        _isStoreRegistered: function() {
            return this._timeEntryStoreObserverHandle != null;
        },

        _registerStore: function(store) {
            if (this._isStoreRegistered()) {
                this._timeEntryStoreObserverHandle.remove();
            }
            this._queryResults = store.query({date: this.date});
            this._timeEntryStoreObserverHandle = this._queryResults.observe(lang.hitch(this, "_timeEntryStoreListener"), true);
            this._refreshView();
        },

        _refreshView: function() {
            this._view.timeEntryStore.clear();
            if (this._queryResults) {
                _.forEach(this._queryResults, lang.hitch(this, "_handleTimeEntryAdded"));
            }
        },

        _timeEntryStoreListener: function(timeEntry, removedFrom, insertedInto) {
            if (removedFrom === -1) {
                this._handleTimeEntryAdded(timeEntry);
            } else if (insertedInto === -1) {
                this._handleTimeEntryRemoved(timeEntry);
            } else if (removedFrom === insertedInto) {
                this._handleTimeEntryModified(timeEntry);
            }
        },

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