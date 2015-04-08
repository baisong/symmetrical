jest.dontMock('../js/symmetrical');

/**
 * 020 symDaysBeforeMonth
 */
describe('[d] symDaysBeforeMonth', function() {
    it('finds the number of days before a month in a given sym year', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symDaysBeforeMonth(6)).toBe(154);
    });
});
describe('[e] symDaysBeforeMonth (alt month rule)', function() {
    it('finds the number of days before a month in a given sym year', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symDaysBeforeMonth(6, symmetrical.alternateMonthRule)).toBe(152);
    });
});
