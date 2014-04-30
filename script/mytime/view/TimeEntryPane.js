define([
    "lodash", "dojo/_base/declare",
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    'mytime/util/DateTimeUtil',
    'dojox/mvc/sync',
    'dojo/text!./TimeEntryPane.html'
], function (
    _, declare,
    _WidgetBase,
    _TemplatedMixin, _WidgetsInTemplateMixin, DateTimeUtil,
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
        }
    });
});