define([
    "lodash", "dojo/_base/declare",
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    'mytime/util/DateTimeUtil', 'mytime/model/modelRegistry',
    'dojox/mvc/sync',
    'dojo/text!./TimeEntryPane.html'
], function (
    _, declare,
    _WidgetBase,
    _TemplatedMixin, _WidgetsInTemplateMixin, DateTimeUtil, modelRegistry,
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
        }
    });
});