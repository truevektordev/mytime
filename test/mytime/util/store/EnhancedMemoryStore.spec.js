describe("mytime/util/store/EnhancedMemoryStore", function() {

    var EnhancedMemoryStore = demand("mytime/util/store/EnhancedMemoryStore");

    it("size()", function() {
        var store = new EnhancedMemoryStore();
        expect(store.size()).toBe(0);
        store.put({id: "a", x: 1});
        expect(store.size()).toBe(1);
        store.put({id: "b", x: 2});
        expect(store.size()).toBe(2);
        store.remove("a");
        expect(store.size()).toBe(1);
    });

    it("clear()", function() {
        var store = new EnhancedMemoryStore();
        store.put({id: "a", x: 1});
        store.put({id: "b", x: 2});
        store.clear();
        expect(store.size()).toBe(0);
        expect(store.get("a")).toEqual(null);
    });

    it("observe()", function() {
        var store = EnhancedMemoryStore.createObservable();
        var spy = jasmine.createSpy();
        store.observe(spy);

        var a;
        store.put(a = {id: "a", x: 1});
        expect(spy).toHaveBeenCalledWith(a, -1, 0);

        spy.reset();
        store.remove("a");
        expect(spy).toHaveBeenCalledWith(a, 0, -1);
    });

    it("size() observable", function() {
        var store = EnhancedMemoryStore.createObservable();
        expect(store.size()).toBe(0);
        store.put({id: "a", x: 1});
        expect(store.size()).toBe(1);
        store.put({id: "b", x: 2});
        expect(store.size()).toBe(2);
        store.remove("a");
        expect(store.size()).toBe(1);
    });

    it("clear() observable", function() {
        var store = EnhancedMemoryStore.createObservable();
        var a,b;
        store.put(a = {id: "a", x: 1});
        store.put(b = {id: "b", x: 2});

        var spy = jasmine.createSpy();
        store.observe(spy);

        store.clear();
        expect(store.size()).toBe(0);
        expect(store.get("a")).toEqual(null);

        expect(spy).toHaveBeenCalledWith(a, 0, -1);
        expect(spy).toHaveBeenCalledWith(b, 1, -1);
    });

});