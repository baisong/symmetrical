jest.dontMock('../js/symmetrical');

describe('sum', function() {
    it('adds 1 + 2 to equal 3', function() {
        var symmetrical = require('../js/symmetrical');
        expect(symmetrical.sum(1, 2)).toBe(3);
    });
});