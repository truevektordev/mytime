define([
    "dojo/_base/declare",
    "lodash",
    "dojo/_base/lang",
    "dojo/string", "dojo/on", "dojo/query",
    "dojo/dom-construct", "dojo/dom-class", "dojo/dom-style", "dojo/dom-geometry",
    "dojo/Evented", "dojo/store/Observable", "dojo/date", "dojo/date/locale",
    "dijit/_WidgetBase",
    "dgrid/OnDemandList",
    "mytime/util/DateTimeUtil", "mytime/util/Colors", "mytime/util/whenAllPropertiesSet",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry.html",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry-edit.html"
],
function (declare,
    _,
    lang,
    stringUtil, on, query,
    domConstruct, domClass, domStyle, domGeometry,
    Evented, Observable, dojoDate, dateLocale,
    _WidgetBase,
    List,
    DateTimeUtil, Colors, whenAllPropertiesSet,
    template, editTemplate) {

    /**
     *
     */
    return declare([_WidgetBase, Evented], {

        baseClass: "timelist",

        date: null,
        timeEntryStore: null,
        taskStore: null,

        editingTimeEntryId: null,

        _entries: null,
        _list: null,
        _timeEntryStoreObserveHandle: null,
        _taskStoreObserveHandle: null,

        buildRendering: function() {
            this.inherited(arguments);
        },

        postCreate: function() {
            this._entries = {};
            this.own(
                whenAllPropertiesSet(this, ["date", "timeEntryStore", "taskStore"], lang.hitch(this, "_initialize"))
            );
        },
        
        _initialize: function() {
            this._list = new List({
                store: this.timeEntryStore,
                query: {date: this.date},
                sort: [{attribute: "startHour"}],
                renderRow: lang.hitch(this, "_renderEntry")
            });

            domConstruct.place(this._list.domNode, this.domNode);
            
            this.own(
                this.watch("date", lang.hitch(this, "_dateChanged"))
            );
        },

        _renderEntry: function(timeEntry) {
            var task = null;
            if (timeEntry.taskId) {
                task = this.taskStore.get(timeEntry.taskId);
            }
            return this._renderEntryWithTask(timeEntry, task);
        },

        _renderEntryWithTask: function(timeEntry, task) {
            var data = {
                Colors: Colors,
                timeEntryId: timeEntry.id,
                taskId: "",
                text: timeEntry.text || "",
                code: "[&nbsp;&nbsp;&nbsp;]",
                name: "No Task",
                color: null
            };
            if (task) {
                data.taskId = task.id || "";
                data.code = task.code || "&nbsp;";
                data.name = task.name || "";
                data.color = task.color || null;
            }
            var html = _.template(template, data);
            return domConstruct.toDom(html);
        },

        _dateChanged: function() {
            this._list.set("query", {date: this.date});
        }

    });
});