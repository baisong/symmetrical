jest.dontMock('../js/symmetrical');

/**
 * 040 symToFixed
 */
describe('[h] symToFixed', function() {
    it('finds the fixed day number for a given sym date (year, month, day)', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.symToFixed(2009, 4, 5)).toBe(733500);
    });
});
