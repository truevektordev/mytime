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
        }

    });
});