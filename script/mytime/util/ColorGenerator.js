/**
 * @license
 * Copyright 2014 David Wolverton
 * Available under MIT license <https://raw.githubusercontent.com/dwolverton/my/master/LICENSE.txt>
 */
define(["dojo/_base/declare"], function (declare) {
    return declare(null, {
        colors: [
            '0,100',
            '30,100',
            '60,100',
            '90,100',
            '120,100',
            '150,100',
            '180,100',
            '210,100',
            '240,100',
            '270,100',
            '300,100',
            '330,100'
        ],

        _index: -1,

        next: function() {
            this._index = (this._index + 1) % this.colors.length;
            return this.colors[this._index];
        }
    });
});