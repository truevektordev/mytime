define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "mytime/DailyTimeWidget/DailyTimeWidgetView"
],
function (declare, _WidgetBase, View) {

    return declare([_WidgetBase], {

        view: null,

        date: null,

        buildRendering: function() {
            this.view = new View();
            this.domNode = this.view.domNode;
        },


    });
});