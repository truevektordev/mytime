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