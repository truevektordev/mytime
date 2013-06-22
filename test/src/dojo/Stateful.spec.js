describe("dojo/Stateful", function() {

    var Stateful = demand("dojo/Stateful");

    it("notifies of a change", function() {
        var o = new Stateful({a: 1, b: 2});
        var spy = jasmine.createSpy();
        o.watch("a", spy);

        o.set("a", 3);
        expect(spy).toHaveBeenCalledWith("a", 1, 3);
    });

    it("even notifies when value is unchanged", function() {
        var o = new Stateful({a: 1, b: 2});
        var spy = jasmine.createSpy();
        o.watch("a", spy);

        o.set("a", 1);
        expect(spy).toHaveBeenCalledWith("a", 1, 1);
    });

});