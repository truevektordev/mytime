define([
    "exports"
],
function (exports) {

    /**
     * Returns the whole number beginning of the hour. For example, 11.5 would return 11.
     * @param {number} time
     * @returns {number}
     */
    exports.beginningOfHour = function(time) {
        return Math.floor(time);
    };

    /**
     * Returns a whole number percentage of the time within the hour. For example, 11.5 would
     * return 50.
     * @param {number} time
     * @returns {number}
     */
    exports.percentageOfHour = function(time) {
        var percentage = time - Math.floor(time);
        return Math.round(percentage * 100);
    };

    /**
     * Convert the given JavaScript Date object to a date string as used to store dates in this
     * application (that is "yyyy-mm-dd").
     * @param {Date} date
     * @returns {string}
     */
    exports.convertDateObjectToDateString = function(date) {
        var year = date.getFullYear(),
            month = (date.getMonth() + 1),
            day = date.getDate();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    };

    /**
     * Get the current date in the standard format for this application.
     * @returns {string}
     */
    exports.getCurrentDate = function() {
        return exports.convertDateObjectToDateString(new Date());
    };
});