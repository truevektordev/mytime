define([],
function () {

    var nextIdByType = {
        'TimeEntry': 1,
        'Task': 1
    };

    return {
        nextIdForType: function(type) {
            return String((nextIdByType[type]++));
        }
    }
});