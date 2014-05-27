/**
 * @license
 * Copyright 2014 David Wolverton
 * Available under MIT license <https://raw.githubusercontent.com/dwolverton/my/master/LICENSE.txt>
 */
define([
    "module", "dojo/_base/declare",
    "mytime/model/_ModelBase"
], function (
    module, declare, _ModelBase
) {
    return declare(module.id, [_ModelBase], {
        _propertyNames: ["id", "code", "name", "color"],

        id: null,
        code: null,
        name: null,
        color: null
    });
});