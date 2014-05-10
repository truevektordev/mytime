define([
    "dojo/store/Memory", "dojo/store/Observable",
    "mytime/util/TransformingStoreView"
], function(
    Memory, Observable,
    TransformingStoreView
) {

    describe("mytime/util/TransformingStoreView", function() {

        var source;
        var observer;
        var transformer;
        beforeEach(function() {
            source = new Observable(new Memory());
            source.add({id: "a", sort: 10});
            source.add({id: "b", sort: 20});
            source.add({id: "c", sort: 30});
            observer = sinon.spy();
            transformer = sinon.spy(function(input) {
                if (input.exclude) {
                    return null;
                }
                return {
                    id: input.id,
                    sort: input.sort * 10
                };
            });
        });

        function setup() {
            return new TransformingStoreView({
                sourceStore: source,
                transform: transformer
            });
        }

        it("transforms initial results", function() {
            var store = setup();
            var queryResults = store.query();
            expect(queryResults).to.have.length(3);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 200});
            expect(queryResults[2]).to.deep.equal({id: "c", sort: 300});
        });
        it("updates when sourceStore changed");
        it("updates when sourceQuery changed", function() {
            var store = setup();
            store.set("sourceQuery", {id: "b"});
            var queryResults = store.query();
            expect(queryResults).to.have.length(1);
            expect(queryResults[0]).to.deep.equal({id: "b", sort: 200});
        });
        it("updates when transform changed", function() {
            var store = setup();
            store.set("transform", function(input) {
                return {
                    id: input.id,
                    sort: input.sort / 10
                };
            });
            var queryResults = store.query();
            expect(queryResults).to.have.length(3);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 1});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 2});
            expect(queryResults[2]).to.deep.equal({id: "c", sort: 3});
        });
        it("updates when result added", function() {
            var store = setup();
            source.put({id: "d", sort: 40});
            var queryResults = store.query();
            expect(queryResults).to.have.length(4);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 200});
            expect(queryResults[2]).to.deep.equal({id: "c", sort: 300});
            expect(queryResults[3]).to.deep.equal({id: "d", sort: 400});
        });
        it("updates when result removed", function() {
            var store = setup();
            source.remove("c");
            var queryResults = store.query();
            expect(queryResults).to.have.length(2);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 200});
        });
        it("updates when result updated", function() {
            var store = setup();
            source.put({id: "c", sort: 35});
            var queryResults = store.query();
            expect(queryResults).to.have.length(3);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 200});
            expect(queryResults[2]).to.deep.equal({id: "c", sort: 350});
        });
        it("notifies when result added");
        it("notifies when result removed");
        it("notifies when result updated");
        it("does not add an item when transform returns falsy", function() {
            var store = setup();
            source.put({id: "d", sort: 40, exclude: true});
            source.put({id: "e", sort: 50});
            var queryResults = store.query();
            expect(queryResults).to.have.length(4);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "b", sort: 200});
            expect(queryResults[2]).to.deep.equal({id: "c", sort: 300});
            expect(queryResults[3]).to.deep.equal({id: "e", sort: 500});
        });
        it("removes an item when transform returns falsy", function() {
            var store = setup();
            source.put({id: "b", sort: 40, exclude: true});
            source.put({id: "c", sort: 50});
            var queryResults = store.query();
            expect(queryResults).to.have.length(2);
            expect(queryResults[0]).to.deep.equal({id: "a", sort: 100});
            expect(queryResults[1]).to.deep.equal({id: "c", sort: 500});
        });

    });
});