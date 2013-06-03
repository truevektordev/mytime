define(["dojo/_base/lang", "dojo/Stateful"], function(lang, Stateful) {
    describe("Jasmine", function() {

//        var lang = demand("dojo/_base/lang");
//        var Stateful = demand("dojo/Stateful");

        it("can be run with JsTestDriver", function() {
            console.log("Hello", "World");
            console.log(polo);

            expect(lang.isString("HELLO")).toBe(true);
            expect(Stateful).not.toBeNull();

            expect("Alpha").toBe("Alpha");
            expect("DDD").toBe("EEE");
        });

    });
});