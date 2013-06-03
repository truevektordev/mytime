buster.testCase("Buster", {
    "states the obvious": function () {
        assert(true);
    },
    "can fail": function() {
        assert(false);
    }
});

(function() {
})();

//define("one-two-three", ['mytime/DailyTimeWidget/DailyTimeWidgetModel'], function(Model) {
//
//    buster.testCase("Buster", {
//        "can holla": function () {
//            assert(false, "Yo yo");
//        },
//        "has model": function() {
//            //assert(Model != null);
//        }
//    });
//
//    return "One Two Three";
//});

buster.testCase("async test",function(run) {
    require(["mytime/DailyTimeWidget/DailyTimeWidgetModel"],function(Model) {
        run({
            "it works": function() { assert(true) },
            "has model": function() { assert(Model != null) }
        })
    });
});