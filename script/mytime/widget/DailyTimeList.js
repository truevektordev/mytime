define([
    "dojo/_base/declare",
    "lodash",
    "dojo/_base/lang",
    "dojo/string", "dojo/on", "dojo/query",
    "dojo/dom-construct", "dojo/dom-class", "dojo/dom-style", "dojo/dom-geometry",
    "dojo/Evented", "dojo/store/Observable", "dojo/date", "dojo/date/locale",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin",
    "mytime/util/DateTimeUtil", "mytime/util/Colors",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry.html",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry-edit.html"
],
function (declare,
    _,
    lang,
    stringUtil, on, query,
    domConstruct, domClass, domStyle, domGeometry,
    Evented, Observable, dojoDate, dateLocale,
    _WidgetBase, _TemplatedMixin,
    DateTimeUtil, Colors,
    template, editTemplate) {

    /**
     *
     */
    return declare([_WidgetBase, Evented], {

        baseClass: 'timelist',

        date: null,
        timeEntryStore: null,
        taskStore: null,

        _entries: null,
        _timeEntryStoreObserveHandle: null,
        _taskStoreObserveHandle: null,

        buildRendering: function() {
            this.inherited(arguments);
        },

        postCreate: function() {
            this._entries = {};
            var _renderOnChange = lang.hitch(this, '_renderOnChange');
            this.own(
                this.watch('date', _renderOnChange),
                this.watch('timeEntryStore', _renderOnChange),
                this.watch('taskStore', _renderOnChange)
            );
            this._renderOnChange('initial', true);
        },

        _renderOnChange: function(property, value, oldValue) {
            if (value !== oldValue && this.date && this.timeEntryStore && this.taskStore) {
                this._render();
            }
        },

        _render: function() {
            this.domNode.innerHTML = '';
            this._entries = {};
            if (this._timeEntryStoreObserveHandle) {
                this._timeEntryStoreObserveHandle.remove();
            }
            var tasks = this.timeEntryStore.query({date: this.date}, {sort: [{attribute: "startHour"}]});
            this._timeEntryStoreObserveHandle = tasks.observe(lang.hitch(this, '_timeEntryStoreObserver'), true);
        },

        _timeEntryStoreObserver: function(object, removedFrom, insertedInto) {
            if (removedFrom > -1) {
                this._timeEntryRemoved(object);
            }
            if (insertedInto > -1) {
                this._timeEntryAdded(object, insertedInto);
            }
        },

        _timeEntryAdded: function(timeEntry, index) {
            var task = null;
            if (timeEntry.taskId) {
                task = this.taskStore.get(timeEntry.taskId);
            }
            this._renderEntry(timeEntry, task, index);
        },

        _renderEntry: function(timeEntry, task, index) {
            var data = {
                Colors: Colors,
                text: timeEntry.text || '',
                code: '&nbsp;',
                name: '',
                color: null
            };
            if (task) {
                data.code = task.code || '&nbsp;';
                data.name = task.name || '';
                data.color = task.color;
            }
            var html = _.template(template, data);
            var previousEntry = this._entries[timeEntry.id];
            if (previousEntry) {
                domConstruct.destroy(previousEntry.dom);
            }
            this._entries[timeEntry.id] = {
                dom: domConstruct.place(html, this.domNode, index),
                index: index
            };
        }


    });
});