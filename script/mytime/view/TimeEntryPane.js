define([
    "lodash", "dojo/_base/lang", "dojo/_base/declare",
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    'mytime/util/DateTimeUtil', 'mytime/model/modelRegistry',
    'mytime/command/AddTimeEntryCommand', 'mytime/command/UpdateTimeEntryCommand',
    'dojox/mvc/sync',
    'dojo/text!./TimeEntryPane.html'
], function (
    _, lang, declare,
    _WidgetBase,
    _TemplatedMixin, _WidgetsInTemplateMixin,
    DateTimeUtil, modelRegistry,
    AddTimeEntryCommand, UpdateTimeEntryCommand,
    sync,
    template
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        _daysInWeekList: null,
        _dailyTimeWidget: null,

        currentDate: DateTimeUtil.getCurrentDate(),

        postCreate: function() {
            this.own(sync(this, 'currentDate', this._daysInWeekList, 'selectedDate'));
            this.own(sync(this, 'currentDate', this._dailyTimeWidget, 'date'));
            this.own(sync(modelRegistry, 'timeEntryStore', this._daysInWeekList, 'timeEntryStore', {bindDirection: sync.from}));
            this.own(sync(modelRegistry, 'timeEntryStore', this._dailyTimeWidget, 'timeEntryStore', {bindDirection: sync.from}));

            this.own(this._dailyTimeWidget.on('createTimeEntry', lang.hitch(this, '_createTimeEntry')))
            this.own(this._dailyTimeWidget.on('updateTimeEntry', lang.hitch(this, '_updateTimeEntry')))
        },

        _createTimeEntry: function(entry) {
            new AddTimeEntryCommand({timeEntry: entry.timeEntry}).exec();
        },

        _updateTimeEntry: function(entry) {
            new UpdateTimeEntryCommand({timeEntry: entry.timeEntry}).exec();
        }
    });
});