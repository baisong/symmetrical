/**
 * @TODO
 *
 * 1. Break up into smaller test suites
 * 2. Add test suite for cross-calculating tabular example test data
 */
jest.dontMock('../js/symmetrical');

/**
 * 000 Jest test
 */
describe('[a] sum', function() {
    it('adds 1 + 2 to equal 3', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.sum(1, 2)).toBe(3);
    });
});


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


/**
 * 040 symToFixed
 */
describe('[h] symToFixed', function() {
    it('finds the fixed day number for a given sym date (year, month, day)', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symToFixed(2009, 4, 5)).toBe(733500);
    });
});

/**
 * 050 fixedToSymYear
 */
describe('[i] fixedToSymYear 1 of 3', function() {
    it('finds the sym year for a given fixed date', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.fixedToSymYear(733649)).toBe(2009);
    });
});

describe('[j] fixedToSymYear 2 of 3', function() {
    it('finds the sym year for a given fixed date', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.fixedToSymYear(733406)).toBe(2009);
    });
});
describe('[j] fixedToSymYear 3 of 3', function() {
    it('finds the sym year for a given fixed date', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.fixedToSymYear(733774)).toBe(2009);
    });
});