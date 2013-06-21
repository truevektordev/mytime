describe("mytime/util/DateTimeUtil", function() {

    var DateTimeUtil = demand("mytime/util/DateTimeUtil");

    it("beginningOfHour", function() {
        expect(DateTimeUtil.beginningOfHour(10)).toEqual(10);
        expect(DateTimeUtil.beginningOfHour(10.2)).toEqual(10);
        expect(DateTimeUtil.beginningOfHour(10.999)).toEqual(10);
    });

    it("percentageOfHour", function() {
        expect(DateTimeUtil.percentageOfHour(10)).toEqual(0);
        expect(DateTimeUtil.percentageOfHour(10.2)).toEqual(20);
        expect(DateTimeUtil.percentageOfHour(10.999)).toEqual(100);
    });

    it("convertDateObjectToDateString", function() {
        expect(DateTimeUtil.convertDateObjectToDateString(new Date("Jan 1 2013"))).toEqual("2013-01-01");
        expect(DateTimeUtil.convertDateObjectToDateString(new Date("Dec 31 2013"))).toEqual("2013-12-31");
        expect(DateTimeUtil.convertDateObjectToDateString(new Date("June 11 1932"))).toEqual("1932-06-11");
    });

});