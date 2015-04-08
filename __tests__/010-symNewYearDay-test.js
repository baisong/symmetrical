jest.dontMock('../js/symmetrical');
/**
 * 010 symNewYearDay
 */
describe('[b] symNewYearDay', function() {
    it('adds finds the fixed day for Jan 1 of a sym year', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symNewYearDay(2010)).toBe(733776);
    });
});
describe('[c] symNewYearDay (alt leap cycle)', function() {
    it('adds finds the fixed day for Jan 1 of a sym year', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symNewYearDay(2010, symmetrical.alternateLeapCycle)).toBe(733769);
    });
});