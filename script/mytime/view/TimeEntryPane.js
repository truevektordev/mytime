define([
    "lodash", "dojo/_base/declare",
    'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin',
    'mytime/util/DateTimeUtil',
    'dojo/text!./TimeEntryPane.html'
], function (
    _, declare,
    _WidgetBase,
    _TemplatedMixin, _WidgetsInTemplateMixin, DateTimeUtil,
    template
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        _daysInWeekList: null,
        _dailyTimeWidget: null,

        currentDate: DateTimeUtil.getCurrentDate()
    });
});