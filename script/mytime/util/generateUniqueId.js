define([], function () {
    var rand = new Date().getTime();
    var counter = 0;
    return function() {
        return (counter++) + "X" + rand;
    }
});