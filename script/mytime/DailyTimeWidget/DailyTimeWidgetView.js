define([
    "module", "dojo/_base/declare",
    "lodash",
    "dojo/_base/lang",
    "dojo/string", "dojo/on", "dojo/query",
    "dojo/dom-construct", "dojo/dom-class", "dojo/dom-style",
    "dojo/store/Memory", "dojo/store/Observable",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin",
    "mytime/dateTimeUtil",
    "dojo/text!./templates/grid.html",
    "dojo/text!./templates/gridrow.html"
],
function (module, declare,
          _,
          lang,
          stringUtil, on, query,
          domConstruct, domClass, domStyle,
          MemoryStore, Observable,
          _WidgetBase, _TemplatedMixin,
          dateTimeUtil,
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
            this._timeBarsByTimeEntryId = {};
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

        _timeBarsByTimeEntryId: null,

        _calculateTimeSlotsForTimeEntry: function(timeEntry) {
            var startHour = dateTimeUtil.beginningOfHour(timeEntry.get("startHour"));
            var startPercentage = dateTimeUtil.percentageOfHour(timeEntry.get("startHour"));

            var endHour = dateTimeUtil.beginningOfHour(timeEntry.get("endHour"));
            var endPercentage = dateTimeUtil.percentageOfHour(timeEntry.get("endHour"));
            if (endPercentage === 0) {
                endHour--;
                endPercentage = 100;
            }

            var slots = [];
            for (var hour = startHour; hour <= endHour; hour++) {
                var first = (hour === startHour);
                var last = (hour === endHour);
                slots.push({
                    hour: hour,
                    startPercentage: first ? startPercentage : 0,
                    endPercentage: last ? endPercentage : 100,
                    isStart: first,
                    isEnd: last
                });
            }
            return slots;
        },

        _timeEntryAdded: function(timeEntry) {
            var timeBars = this._timeBarsByTimeEntryId[timeEntry.get("id")] = [];
            _.forEach(this._calculateTimeSlotsForTimeEntry(timeEntry), function(slot) {
                var timebar = domConstruct.create("div", {"class": "time-bar"});
                domStyle.set(timebar, "background-color", timeEntry.get("color"));
                domStyle.set(timebar, "left", slot.startPercentage + "%");
                domStyle.set(timebar, "right", (100 - slot.endPercentage) + "%");

                if (slot.isStart) {
                    domClass.add(timebar, "start");
                }
                if (slot.isEnd) {
                    domClass.add(timebar, "end");
                }

                timeBars.push(timebar);
                domConstruct.place(timebar, this._getContainerForHour(slot.hour));
            }, this);
        },

        _timeEntryRemoved: function(timeEntry) {
            var timeBars = this._timeBarsByTimeEntryId[timeEntry.get("id")];
            _.forEach(timeBars, function(timebar) {
                domConstruct.destroy(timebar);
            });
            delete this._timeBarsByTimeEntryId[timeEntry.get("id")];
        },

        _startOrEndHourChanged: function(property, prev, value) {
            if (prev !== value) {
                this._renderRows();
            }
        }
    });
});