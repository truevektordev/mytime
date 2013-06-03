jstestdriver.plugins.async.CallbackPool.TIMEOUT = 1000;

//DailyTimeWidgetModelTest = TestCase("DailyTimeWidgetModelTest");
//
//DailyTimeWidgetModelTest.prototype.testSetAndRetrieveValues = function() {
//    assertTrue("Yes Inline", true);
//};

MyAsyncTest = AsyncTestCase("MyAsyncTest");

//MyAsyncTest.prototype.testSetAndRetrieveValues = function(queue) {
//    queue.call("??", function(callbacks) {
//        var finished = callbacks.noop();
//        require(["dojo/_base/lang"], function(lang) {
//
//            lang.hitch(this, function() {
//                alert('hi');
//            });
//
//            assertTrue("Later.", false);
//
//            finished();
//        });
//    });
//};

function defineTest(testCase, testName, dependencies, func) {
    testCase.prototype[testName] = function(queue) {
        var _this = this;
        queue.call(function(callbacks) {
            var finished = callbacks.noop();
            require(dependencies, function() {
                func.apply(_this, arguments);
                finished();
            });
        });
    };
}

defineTest(MyAsyncTest, "testDefineTest", ["dojo/_base/lang"], function(lang) {
    lang.hitch(this, function() {
        alert('hi');
    });

    assertTrue("Later.", false);

    finished();
});