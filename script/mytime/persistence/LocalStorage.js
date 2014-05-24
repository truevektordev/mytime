define([
    "exports", "lodash", "dojo/_base/lang",
    "mytime/model/TimeEntry"
],
function (exports, _, lang) {
    lang.mixin(exports, {

        persistStoreData: function(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },

        retrieveStoreData: function(key, constructor) {
            var data = localStorage.getItem(key);
            data = JSON.parse(data || "[]");
            if (constructor) {
                for (var i = 0; i < data.length; i++) {
                    data[i] = new constructor(data[i]);
                }
            }
            return data;
        },

        persistStore: function(key, store) {
            this.persistStoreData(key, store.query());
        },

        loadStore: function(key, store, constructor) {
            var data = this.retrieveStoreData(key, constructor);
            _.forEach(data, function(item) {
                store.add(item);
            });
            return store;
        }
    });
});