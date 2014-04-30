define([
    "dojo/_base/declare",
    "lodash",
    "dojo/_base/lang",
    "dojo/string", "dojo/on", "dojo/query",
    "dojo/dom-construct", "dojo/dom-class", "dojo/dom-style", "dojo/dom-geometry",
    "dojo/Evented", "dojo/store/Observable", "dojo/date", "dojo/date/locale",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin",
    "mytime/util/DateTimeUtil",
    "dojo/text!mytime/widget/DaysInWeekList/template.html"
],
function (declare,
    _,
    lang,
    stringUtil, on, query,
    domConstruct, domClass, domStyle, domGeometry,
    Evented, Observable, dojoDate, dateLocale,
    _WidgetBase, _TemplatedMixin,
    DateTimeUtil,
    template) {

    /**
     *
     * emits:
     * - The following four drag events each have the event data { startHour: hour where the drag began, endHour hour
     *   where the drag finished or currently is}
     * - startDrag, updateDrag, endDrag and cancelDrag
     */
    return declare([_WidgetBase, _TemplatedMixin, Evented], {
        templateString: template,
        selectedDate: DateTimeUtil.getCurrentDate(),
        _firstDayOfWeek: null,
        _selectedDayOfWeek: null,

        _headerNode: null,
        _containerNode: null,
        _dayRowNodes: null,
        _dayDateNodes: null,
        _dayHoursNodes: null,
        _WeekTotalNode: null,
        _WeekDiffNode: null,

        _setSelectedDateAttr: function(value) {
            this._set('selectedDate', value);
            var date = DateTimeUtil.convertDateStringToDateObject(value);
            this._selectedDayOfWeek = date.getDay();
            this._firstDayOfWeek = dojoDate.add(date, 'day', -this._selectedDayOfWeek);
            this._fillIn();
        },

        buildRendering: function() {
            this.inherited(arguments);
            var rows = query('tr', this._containerNode);
            this._dayRowNodes = [];
            this._dayDateNodes = [];
            this._dayHoursNodes = [];
            for (var i = 0; i < 7; i++) {
                var row = rows[i];
                this._dayRowNodes[i] = row;
                this._dayDateNodes[i] = row.cells[0];
                this._dayHoursNodes[i] = row.cells[2];
            }
            this._fillIn();
        },

        _fillIn: function() {
            if (!this._headerNode || !this._firstDayOfWeek) {
                return; // too early to render
            }

            for (var i = 0; i < 7; i++) {
                var selected = this._selectedDayOfWeek === i;
                var date = this._getDateOfNthDay(i);

                domClass.toggle(this._dayRowNodes[i], 'selected', selected);
                this._dayDateNodes[i].innerHTML = DateTimeUtil.numberToStringWithNth(date.getDate());
            }

            var headerText = this._formatDate(this._firstDayOfWeek, 'd MMM') + ' - ' +
                this._formatDate(this._getDateOfNthDay(6), 'd MMM yyyy');
            this._headerNode.innerHTML = headerText;
        },

        _formatDate: function (date, pattern) {
            return dateLocale.format(date, {selector: 'date', datePattern: pattern});
        },

        postCreate: function() {
            var _this = this;
            on(this._containerNode, on.selector('tr', 'click'), function() {
                var row = this;
                for (var i = 0; i < 7; i++) {
                    if (row === _this._dayRowNodes[i]) {
                        var dateToSelect = DateTimeUtil.convertDateObjectToDateString(_this._getDateOfNthDay(i));
                        if (dateToSelect !== _this.selectedDate) {
                            _this.set('selectedDate', dateToSelect);
                        }
                    }
                }
            });
        },

        _getDateOfNthDay: function(n) {
            return dojoDate.add(this._firstDayOfWeek, 'day', n);
        }
    });
});