define(["./LocalStorage"],
function (LocalStorage) {

    var lastIdByType = {
        'TimeEntry': LocalStorage.retrieveObject("lastTimeEntryId") || 0,
        'Task': LocalStorage.retrieveObject("lastTaskId") || 0
    };

    return {
        nextIdForType: function(type) {
            var id = ++lastIdByType[type];
            LocalStorage.persistObject("last" + type + "Id", id);
            return String((id));
        }
    }
});