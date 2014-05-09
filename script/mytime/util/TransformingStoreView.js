define([
    "lodash", "dojo/_base/lang", "dojo/_base/declare",
    "dojo/Stateful", "dojo/when",
    "dijit/Destroyable",
    "mytime/util/EnhancedMemoryStore", "mytime/util/delegateObserve"
], function(
    _, lang, declare,
    Stateful, when,
    Destroyable,
    EnhancedMemoryStore, delegateObserve
) {
    /**
     * @class TransformingStoreView
     *
     * An EnhancedMemoryStore that mirrors the results of a query against another store, but contains a transformed
     * version of the elements in that other store. Additionally some items may be excluded.
     */
    return declare([EnhancedMemoryStore, Stateful, Destroyable], {

        /**
         * Source store from which to draw items. Must be Observable.
         */
        sourceStore: null,

        /**
         * Optional query to use against the source store
         */
        sourceQuery: null,

        /**
         * The function to use for transforming the items from the source store into items for this store. The source
         * store item is passed in, and the transformed item should be returned. If a falsy value is returned, nothing
         * will be added to this store, and in the case of update any existing corresponding item will be removed.
         *
         * For an update, the previous transformed object is also passed in as a second parameter.
         *
         * Note that the ID of the transformed item must be the same as the ID of the source item. However, the id
         * property name may be different, as set by the idProperty of this store.
         *
         * @type {function({*} sourceObject, {*} ?previousTransformedObject)}
         */
        transform: null,

        _observeHandle: null,

        constructor: function(args) {
            lang.mixin(this, args);
            var _refreshWatcher = lang.hitch(this, "_refreshWatcher");
            this.watch("sourceStore", _refreshWatcher);
            this.watch("sourceQuery", _refreshWatcher);
            this.watch("transform", _refreshWatcher);
            this._refreshIfReady();
        },

        _refreshWatcher: function(property, oldValue, value) {
            if (value !== oldValue) {
                this._refreshIfReady();
            }
        },

        _refreshIfReady: function() {
            if (this.sourceStore && this.transform) {
                this.refresh();
            }
        },

        refresh: function() {
            if (this._observeHandle) {
                this._observeHandle.remove();
            }
            this.clear();

            var queryResult = this.sourceStore.query(this.sourceQuery);
            this._observeHandle = queryResult.observe(delegateObserve("_onInsert", "_onRemove", "_onUpdate", this), true);

            when(queryResult, lang.hitch(this, function(results) {
                _.forEach(results, lang.hitch(this, "_onInsert"));
            }));
        },

        _onInsert: function(object) {
            var transformed = this.transform(object);
            if (transformed) {
                this.put(transformed);
            }
        },

        _onUpdate: function(object) {
            var id = this.sourceStore.getIdentity(object);
            var previous = id && this.get(id);
            var transformed = this.transform(object, previous);
            if (transformed) {
                this.put(transformed);
            } else {
                this.remove(id);
            }
        },

        _onRemove: function(object) {
            var id = this.sourceStore.getIdentity(object);
            if (id) {
                this.remove(id);
            }
        },

        destroy: function() {
            this.inherited(arguments);
            if (this._observeHandle) {
                this._observeHandle.remove();
            }
        }

    });
});