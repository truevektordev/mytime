(function() {
describe("Number 2", function() {

    var lang = demand("dojo/_base/lang");
    var Deferred = demand("dojo/Deferred");
    var query = demand("dojo/query");
    var Dialog = demand("dijit/Dialog");
    var parser = demand("dojo/parser");
    var registry = demand("dijit/registry");

    it("letter A", function() {
        expect(lang.isString("HELLO")).toBe(true);
        expect(Deferred).not.toBeNull();

        expect("Alpha").toBe("Alpha");
        expect("DDD").toBe("EEE");
    });

    it("letter B", function() {
        expect("Something Expected").toBe("Something Expected");
        expect("Unexpected").toBe("Something Expected");
    });

    it("accesses the DOM", function() {
        var bd = document.body;
        console.info("A", bd.innerHTML);

        bd.innerHTML = "Hello World";
        console.info("B", bd.innerHTML);
    });

    it("accesses the DOM again", function() {
        var bd = document.body;
        console.info("C", bd.innerHTML);

        bd.innerHTML = "Fortran";
        console.info("D", bd.innerHTML);
    });

    it("accesses the DOM again", function() {
        var it;
        runs(function() {
            document.body.innerHTML = '<div id="it" data-dojo-type="dijit/Dialog" data-dojo-props="title: &quot;Amazing!&quot;"><h1>Hello World</h1></div>';
            document.body.className = "claro";
            parser.parse();
            it = registry.byId('it');
            it.show();
        });
        waits(5000);
        runs(function() {
            it.destroyRecursive();
        });
    });

});
})();