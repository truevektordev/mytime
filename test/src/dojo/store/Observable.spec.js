describe("dojo/store/Observable", function() {

    var MemoryStore = demand("dojo/store/Memory");
    var Observable = demand("dojo/store/Observable");
    var Stateful = demand("dojo/Stateful");

    it("does NOT notify when a stateful property changes that changes query results", function() {
        var a = new Stateful({id: "a", x: 1});
        var b = new Stateful({id: "b", x: 2});

        var spy = jasmine.createSpy();
        var store = new Observable(new MemoryStore());
        var results = store.query({x: 1});
        results.observe(spy, true);
        expect(results.length).toBe(0);

        store.put(a);
        store.put(b);
        expect(results.length).toBe(1);
        expect(spy).toHaveBeenCalledWith(a, -1, 0);
        spy.reset();

        b.set("x", 1);
        expect(results.length).not.toBe(2);
        expect(spy).not.toHaveBeenCalledWith(b, -1, 1);
    });

    it("notifies when an object is re-put that changes query results", function() {
        var a = new Stateful({id: "a", x: 1});
        var b = new Stateful({id: "b", x: 2});

        var spy = jasmine.createSpy();
        var store = new Observable(new MemoryStore());
        var results = store.query({x: 1});
        results.observe(spy, true);
        expect(results.length).toBe(0);

        store.put(a);
        store.put(b);
        expect(results.length).toBe(1);
        expect(spy).toHaveBeenCalledWith(a, -1, 0);
        spy.reset();

        b.set("x", 1);
        store.put(b);
        expect(results.length).toBe(2);
        expect(spy).toHaveBeenCalledWith(b, -1, 1);
    });

});