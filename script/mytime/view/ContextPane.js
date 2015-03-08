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

            // first get each of the contexts (lodash foreach doesn't work so well on localStorage)
            for(var key in localStorage) {
                var pieces = key.split('~');

                if(pieces.length > 1) {
                    contexts[pieces[0]] = true;
                }
            }

            // loop through list of contexts, and create link
            _.forEach(contexts, function(__, context) {
                var attrs = {
                    href: '?ctx=' + context,
                    innerHTML: context
                };

                domConstruct.create('a', attrs, this.domNode);
            }, this);
        }

    });
});