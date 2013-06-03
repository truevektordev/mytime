define([
    "module", "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/string", "dojo/on", "dojo/query",
    "dojo/dom-construct", "dojo/dom-class", "dojo/dom-style",
    "dojo/store/Memory", "dojo/store/Observable",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin",
    "dojo/text!./templates/grid.html",
    "dojo/text!./templates/gridrow.html"
],
function (module, declare,
          lang,
          stringUtil, on, query,
          domConstruct, domClass, domStyle,
          MemoryStore, Observable,
          _WidgetBase, _TemplatedMixin,
          template,
          gridRowTemplate) {

    return declare(module.id, [_WidgetBase, _TemplatedMixin], {
        templateString: template,
        currentDateLabel: null,
        timeRowsContainer: null,

        startHour: 7,
        endHour: 19,

        timeEntryStore: null,

        constructor: function() {
            this.timeEntryStore = new Observable(new MemoryStore());
            this._timeslotsByTimeEntryId = {};
        },

        buildRendering: function() {
            this.inherited(arguments);
            this._renderRows();
        },

        _renderRows: function() {
            var html = "";
            for (var hour = this.startHour; hour <= this.endHour; hour++) {
                var label = this._getLabelForHour(hour);
                html += stringUtil.substitute(gridRowTemplate, { hourLabel: label });
            }
            this.timeRowsContainer.innerHTML = html;
        },

        _getLabelForHour: function(hour) {
            if (hour <= 12) {
                return hour + ":00 am";
            } else {
                return (hour - 12) + ":00 pm";
            }
        },

        _getContainerForHour: function(hour) {
            return query("td", this.timeRowsContainer)[hour - this.startHour];
        },

        postCreate: function() {
            this.own(
                this.watch('startHour', lang.hitch(this, "_startOrEndHourChanged")),
                this.watch('endHour', lang.hitch(this, "_startOrEndHourChanged")),
                this.timeEntryStore.query({}).observe(lang.hitch(this, '_timeEntryStoreListener'))
            );
        },

        _timeEntryStoreListener: function(object, removedFrom, insertedInto) {
            if (removedFrom > -1) {
                this._timeEntryRemoved(object);
            }
            if (insertedInto > -1) {
                this._timeEntryAdded(object);
            }
        },

        _timeslotsByTimeEntryId: null,

        _timeEntryAdded: function(timeEntry) {
            var startHour = Math.floor(timeEntry.get("startHour"));
            var startPercentage = timeEntry.get("startHour") - startHour;
            startPercentage = Math.round(startPercentage * 100);


            var endHour = Math.floor(timeEntry.get("endHour"));
            var endPercentage = timeEntry.get("endHour") - endHour;
            endPercentage = Math.round(endPercentage * 100);
            if (endPercentage === 0) {
                endHour--;
                endPercentage = 100;
            }

            for (var hour = startHour; hour <= endHour; hour++) {
                var timeslot = domConstruct.create("div", {"class": "time-bar"});
                domStyle.set(timeslot, "background-color", timeEntry.get("color"));
                var first = (hour === startHour);
                var last = (hour === endHour);

                if (first) {
                    domClass.add(timeslot, "start");
                    domStyle.set(timeslot, "left", startPercentage + "%");
                }
                if (last) {
                    domClass.add(timeslot, "end");
                    domStyle.set(timeslot, "right", (100 - endPercentage) + "%");
                }

                this._timeslotsByTimeEntryId[timeEntry.get("id")] = timeslot;
                domConstruct.place(timeslot, this._getContainerForHour(hour));
            }
        },

        _timeEntryRemoved: function(timeEntry) {

        },

        _startOrEndHourChanged: function(property, prev, value) {
            if (prev !== value) {
                this._renderRows();
            }
        }
    });
});