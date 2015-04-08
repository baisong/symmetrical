jest.dontMock('../js/symmetrical');

/**
 * 030 symDayOfYear
 */
describe('[f] symDayOfYear', function() {
    it('finds the ordinal number of a day of sym year based on month and day of month', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symDayOfYear(6, 17)).toBe(171);
    });
});

describe('[g] symDayOfYear (alt month rule)', function() {
    it('finds the ordinal number of a day of sym year based on month and day of month', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symDayOfYear(6, 17, symmetrical.alternateMonthRule)).toBe(169);
    });
});