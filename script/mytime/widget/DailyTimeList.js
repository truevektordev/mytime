/**
 * @license
 * Copyright 2014 David Wolverton
 * Available under MIT license <https://raw.githubusercontent.com/dwolverton/my/master/LICENSE.txt>
 */
define([
    "lodash", "dojo/_base/lang", "dojo/_base/declare",
    "dojo/dom-construct", "dojo/dom-attr", "dojo/on", "dojo/query", "dojo/Evented",
    "dijit/_WidgetBase",
    "mytime/widget/TaskPickerCombo",
    "mytime/model/TimeEntry",
    "mytime/command/UpdateTimeEntryCommand",
    "mytime/util/Colors", "mytime/util/whenAllPropertiesSet", "mytime/util/store/TransformingStoreView",
    "mytime/util/store/StoreDrivenDom", "mytime/util/store/delegateObserve",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry.html",
    "dojo/text!mytime/widget/DailyTimeList/templates/entry-edit.html"
],
function (
    _, lang, declare,
    domConstruct, domAttr, on, query, Evented,
    _WidgetBase,
    TaskPickerCombo,
    TimeEntry,
    UpdateTimeEntryCommand,
    Colors, whenAllPropertiesSet, TransformingStoreView,
    StoreDrivenDom, delegateObserve,
    template, editTemplate) {

    /**
     *
     */
    return declare([_WidgetBase, Evented], {

        baseClass: "timelist",

        date: null,
        timeEntryStore: null,
        taskStore: null,

        selectedId: null,
        editingId: null,
        _editingStartData: null,

        _internalStore: null,
        _list: null,

        _taskCombo: null,

        buildRendering: function() {
            this.inherited(arguments);
        },

        postCreate: function() {
            var _this = this;
            this.own(
                whenAllPropertiesSet(this, ["date", "timeEntryStore", "taskStore"], lang.hitch(this, "_initialize")),
                on(this.domNode, on.selector(".timeentry", "click"), function(event) {
                    // NOTE: for 'on' with selector, 'this' is the node identified by the selector.
                    _this._onEntryClick(event, this);
                })
            );
        },
        
        _initialize: function() {
            this._setupTaskCombo();
            this._internalStore = new TransformingStoreView({
                sourceStore: this.timeEntryStore,
                sourceQuery: {date: this.date},
                transform: lang.hitch(this, function(input) {
                    var entry = new TimeEntry(input);
                    entry.selected = entry.id === this.selectedId;
                    entry.editing = entry.id === this.editingId;
                    return entry;
                })
            }).getObservable();
            this._list = new StoreDrivenDom({
                store: this._internalStore,
                queryOptions: {sort: [{attribute: "startHour"}]},
                renderNode: lang.hitch(this, "_renderEntry")
            });

            this._list.placeAt(this.domNode);

            this.own(
                this.watch("date", lang.hitch(this, "_dateChanged")),
                this.watch("editingId", lang.hitch(this, "_editingOrSelectedIdChanged")),
                this.watch("selectedId", lang.hitch(this, "_editingOrSelectedIdChanged")),
                this._internalStore.observe(delegateObserve("_onTimeEntryAdded", null, null, this))
            );
        },

        _setupTaskCombo: function() {
            this._taskCombo = new TaskPickerCombo({
                store: this.taskStore
            });
            this.own(
                on(this._taskCombo, "change", lang.hitch(this, "_onTaskComboChange"))
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
                duration: timeEntry.endHour - timeEntry.startHour,
                code: "[&nbsp;&nbsp;&nbsp;]",
                name: "No Task",
                color: null,
                selected: timeEntry.selected,
                jiraLoggable: false
            };
            if (task) {
                data.taskId = task.id || "";
                data.code = task.code || "&nbsp;";
                data.name = task.name || "";
                data.color = task.color || null;
                data.jiraLoggable = task.code.indexOf('CAYENNE-') == 0 || task.code.indexOf('PSP-') == 0;
            }
            if (timeEntry.editing) {
                return this._renderEditingEntry(timeEntry, task, data);
            } else {
                var html = _.template(template, data);
                return domConstruct.toDom(html);
            }
        },

        _renderEditingEntry: function(timeEntry, task, data) {
            var html = _.template(editTemplate, data);
            var dom = domConstruct.toDom(html);

            this._editingStartData = {
                taskId: task ? task.id : null,
                text: timeEntry.text
            };

            var comboContainer = query(".task", dom)[0];
            this._taskCombo.set("task", task);
            this._taskCombo.placeAt(comboContainer);
            this._taskCombo.startup();

            return dom;
        },

        _dateChanged: function() {
            this._internalStore.set("sourceQuery", {date: this.date});
        },

        _onEntryClick: function(event, entryNode) {
            var id = domAttr.get(entryNode, "data-timeentry-id");
            this.set("editingId", id);
            this.set("selectedId", id);
        },

        _editingOrSelectedIdChanged: function(prop, prevValue, value) {
            if (value !== prevValue) {
                if (prevValue) {
                    this._internalStore.refreshItem(prevValue);
                }
                if (value) {
                    this._internalStore.refreshItem(value);
                    if (prop === "editingId") {
                        this._taskCombo.focusAndSelectAll();
                    }
                }

                if (prop === "selectedId") {
                    // When a new different item is selected, stop editing the previous selection.
                    if (this.editingId && value !== this.editingId) {
                        this.set("editingId", null);
                    }
                }
            }
        },

        _onTaskComboChange: function() {
            var task = this._taskCombo.get('task');
            var taskId = task ? task.id : null;
            if (taskId !== this._editingStartData.taskId) {
                this._editingStartData.taskId = taskId;
                new UpdateTimeEntryCommand({timeEntry: {
                    id: this.editingId,
                    taskId: taskId
                }}).exec();
            }
        },

        _onTimeEntryAdded: function(timeEntry) {
            // When an new time entry is added switch to editing it.
            _.defer(lang.hitch(this, function() {
                this.set("editingId", timeEntry.id);
                this.set("selectedId", timeEntry.id);
            }));
        }

    });
});