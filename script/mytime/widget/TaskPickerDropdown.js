define([
    "lodash", "dojo/_base/lang", "dojo/_base/declare",
    "dijit/form/ComboBox"
],
function (
    _, lang, declare,
    ComboBox
) {
    return declare([ComboBox], {

        searchAttr: 'code',

        _getTaskAttr: function() {
            return this.get('item');
        },

        _setTaskAttr: function(task) {
            this.set('item', task);
        }

//        _getValueAttr: function() {
//            var code = this.inherited(arguments);
//            if (code) {
//                return this.store.query({code: code})[0];
//            } else {
//                return null;
//            }
//        },
//
//        _setValueAttr: function(task) {
//            this.inherited('_setValueAttr', [task.code]);
//        }
    });
});