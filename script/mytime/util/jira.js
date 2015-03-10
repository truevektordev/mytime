define([
    "lodash", "exports",
    "dojo/_base/lang", "dojo/_base/declare",
    "mytime/util/DateTimeUtil",
    "mytime/persistence/LocalStorage"
], function (
    _, exports,
    lang, declare,
    DateTimeUtil,
    LocalStorage) {

    /**
     * Does the given string match the JIRA issue key format.
     * @param {string} s
     */
    exports.isJiraIssueKey = function(s) {
        return !! ( s && s.match(/^[A-Z]+-\d+$/) );
    };

    exports.buildTimeLoggingLink = function(issueKey, timeEntry) {
        var base = LocalStorage.retrieveObject("jiraBase");
        
        return  base + encodeURIComponent(issueKey) +
            "&timeLogged=" + DateTimeUtil.formatWithTwoDecimals( DateTimeUtil.duration(timeEntry) ) +
            "h&timeEntyId=" + encodeURIComponent(timeEntry.id) +
            "&comment=" + encodeURIComponent(timeEntry.text || "");
    };
});