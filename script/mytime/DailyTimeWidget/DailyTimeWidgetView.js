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

        _timeBarsByTimeEntryId: null,
        _timeEntryWatchers: null,

        constructor: function() {
            this.timeEntryStore = new Observable(new MemoryStore());
            this._timeBarsByTimeEntryId = {};
            this._timeEntryWatchers = {};
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

        _getHourForContainer: function(containerNode) {
            var hour = this.startHour;
            query("td", this.timeRowsContainer).some(function(cell) {
                if (cell === containerNode) {
                    return true;
                }
                hour++;
            });
            return hour;
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
            this._buildTimeBarsForTimeEntry(timeEntry);
            this._timeEntryWatchers[timeEntry.get("id")] = timeEntry.watch(lang.hitch(this, "_timeEntryPropertyChanged", timeEntry))
        },

        _timeEntryPropertyChanged: function(timeEntry, property, prev, value) {
            if (property === "color") {
                _.forEach(this._timeBarsByTimeEntryId[timeEntry.get("id")], function(timeBar) {
                    this._setTimeBarAttributes(timeBar, timeEntry);
                }, this);
            } else if (property === "startHour" || property == "endHour") {
                this._adjustTimeBars(timeEntry);
            }
        },

        _adjustTimeBars: function(timeEntry) {
            var timeBars = this._timeBarsByTimeEntryId[timeEntry.get("id")];
            var firstTimeBarHour = this._getHourForContainer(timeBars[0].parentNode);
            var lastTimeBarHour = firstTimeBarHour + timeBars.length - 1;

            var slots = this._calculateTimeSlotsForTimeEntry(timeEntry);
            var startHour = slots[0].hour;
            var endHour = startHour + slots.length - 1;

            for (firstTimeBarHour; firstTimeBarHour < startHour; firstTimeBarHour++) {
                domConstruct.destroy(timeBars.shift());
            }
            for (lastTimeBarHour; lastTimeBarHour > endHour; lastTimeBarHour--) {
                domConstruct.destroy(timeBars.pop());
            }

            var i = 0;
            for (var hour = startHour; hour <= endHour; hour++) {
                if (hour < firstTimeBarHour || hour > lastTimeBarHour) {
                    var timeBar = this._createTimeBar(timeEntry, slots[i]);
                    timeBars.splice(hour - startHour, 0, timeBar);
                    this._placeTimeBar(timeBar, hour);
                } else {
                    this._setTimeBarSize(timeBars[hour - startHour], slots[i]);
                }
                i++;
            }
        },

        _buildTimeBarsForTimeEntry: function(timeEntry) {
            var timeBars = this._timeBarsByTimeEntryId[timeEntry.get("id")] = [];
            _.forEach(this._calculateTimeSlotsForTimeEntry(timeEntry), function(slot) {
                var timebar = this._createTimeBar(timeEntry, slot);
                timeBars.push(timebar);
                this._placeTimeBar(timebar, slot.hour);
            }, this);
        },

        _placeTimeBar: function(timebar, hour) {
            domConstruct.place(timebar, this._getContainerForHour(hour));
        },

        _createTimeBar: function(timeEntry, slot) {
            var timeBar = domConstruct.create("div", {"class": "time-bar"});
            if (timeEntry) {
                this._setTimeBarAttributes(timeBar, timeEntry);
            }
            if (slot) {
                this._setTimeBarSize(timeBar, slot);
            }
            return timeBar;
        },

        _setTimeBarAttributes: function(timeBar, timeEntry) {
            domStyle.set(timeBar, "background-color", timeEntry.get("color"));
        },

        _setTimeBarSize: function(timeBar, slot) {
            domStyle.set(timeBar, "left", slot.startPercentage + "%");
            domStyle.set(timeBar, "right", (100 - slot.endPercentage) + "%");
            domClass.toggle(timeBar, "start", slot.isStart);
            domClass.toggle(timeBar, "end", slot.isEnd);
        },

        _timeEntryRemoved: function(timeEntry) {
            var timeBars = this._timeBarsByTimeEntryId[timeEntry.get("id")];
            _.forEach(timeBars, function(timeBar) {
                domConstruct.destroy(timeBar);
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