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
});