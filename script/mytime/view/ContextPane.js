/**
 * @license
 * Copyright 2015 Eric Henry
 * Available under MIT license
 */
define([
    "lodash", "dojo/_base/declare",
    "dojo/dom-construct",
    'dijit/_WidgetBase'
], function (
    _, declare,
    domConstruct,
    _WidgetBase
) {

    return declare([_WidgetBase], {

        postCreate: function() {
            "use strict";

            var contexts = {};

            // first get each of the contexts
            _.forEach(localStorage, function(__, key) {
                var pieces = key.split('~');
                if(pieces.size() > 1) {
                    contexts[pieces[0]] = true;
                }
            });

            // loop through list of contexts, and create link
            _.forEach(contexts, function(__, context) {
                var attrs = {
                    href: '?ctx=' + context
                };

                domConstruct.create('a', attrs, this.domNode);
            }, this);
        }

    });
});