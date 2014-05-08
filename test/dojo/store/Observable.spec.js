define(["dojo/store/Memory", "dojo/store/Observable", "dojo/Stateful"], function(MemoryStore, Observable, Stateful) {

    describe("dojo/store/Observable", function() {

        it("does NOT notify when a stateful property changes that changes query results", function() {
            var a = new Stateful({id: "a", x: 1});
            var b = new Stateful({id: "b", x: 2});

            var spy = sinon.spy();
            var store = new Observable(new MemoryStore());
            var results = store.query({x: 1});
            results.observe(spy, true);
            expect(results.length).to.equal(0);

            store.put(a);
            store.put(b);
            expect(results.length).to.equal(1);
            expect(spy).to.have.been.calledWith(a, -1, 0);
            spy.reset();

            b.set("x", 1);
            expect(results.length).not.to.equal(2);
            expect(spy).not.to.have.been.calledWith(b, -1, 1);
        });

        it("notifies when an object is re-put that changes query results", function() {
            var a = new Stateful({id: "a", x: 1});
            var b = new Stateful({id: "b", x: 2});

            var spy = sinon.spy();
            var store = new Observable(new MemoryStore());
            var results = store.query({x: 1});
            results.observe(spy, true);
            expect(results.length).to.equal(0);

            store.put(a);
            store.put(b);
            expect(results.length).to.equal(1);
            expect(spy).to.have.been.calledWith(a, -1, 0);
            spy.reset();

            b.set("x", 1);
            store.put(b);
            expect(results.length).to.equal(2);
            expect(spy).to.have.been.calledWith(b, -1, 1);
        });

    });

});