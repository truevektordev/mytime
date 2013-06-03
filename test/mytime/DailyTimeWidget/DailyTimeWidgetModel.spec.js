(function() {
describe("Jasmine", function() {

    var lang = demand("dojo/_base/lang");
    var Stateful = demand("dojo/Stateful");

    it("can be run with JsTestDriver", function() {
        expect(lang.isString("HELLO")).toBe(true);
        expect(Stateful).not.toBeNull();

        expect("Alpha").toBe("Alpha");
        expect("DDD").toBe("EEE");
    });

    it("has another spec", function() {
        expect("Something Expected").toBe("Something Expected");
        expect("Unexpected").toBe("Something Expected");
    })

});
})();