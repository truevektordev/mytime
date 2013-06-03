jstestdriver.plugins.async.CallbackPool.TIMEOUT = 1000;

function AMDTest(dependencies, func) {
    return function(queue) {
        var _this = this;
        queue.call(function(callbacks) {
            var finished = callbacks.noop();
            require(dependencies, function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.push(queue);
                func.apply(_this, args);
                finished();
            });
        });
    };
}

DailyTimeWidgetModelTestAMD = AsyncTestCase("DailyTimeWidgetModelTestAMD");

DailyTimeWidgetModelTestAMD.prototype.setUp = function(queue) {
    console.log("Cheers");
    var finished = callbacks.noop();
    require("dojo/Deferred", function() {
        console.log("Set up done.");
        finished();
    });
};

DailyTimeWidgetModelTestAMD.prototype.testWhatever = function() {
    assertTrue("Lucky Lindy", false);
};

DailyTimeWidgetModelTestAMD.prototype.testFred = AMDTest(['dojo/_base/lang'], function(lang, queue) {
    assertTrue("Is 'Hello' string?", lang.isString('Hello'));
    assertTrue("Is queue object?", lang.isObject(queue));
    assertTrue("Is 123 string?", lang.isString(123));
});

DailyTimeWidgetModelTestAMD.prototype.testNancy = AMDTest(['dojo/_base/lang'], function(lang, queue) {
    assertTrue("Is 'Hello' string?", lang.isString('Hello'));
    assertTrue("Is queue object?", lang.isObject(queue));
    assertTrue("Is 123 string?", lang.isString(123));
});