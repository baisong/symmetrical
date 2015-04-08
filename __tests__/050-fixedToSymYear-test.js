jest.dontMock('../js/symmetrical');

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