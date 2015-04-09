jest.dontMock('../js/symmetrical');

var symmetrical = require('../js/symmetrical');
/*
var rows = symmetrical.testData;
var total = rows.length;
for (var i = 0; i < total; i++) {
    describe('[+] fixedToSymYear ' + (i + 1) + ' of ' + total, function() {
        it('convert from gregorian back to gregorian', function() {
            var row = rows.shift();
            var gregDateOrig = row.gregorianDate;
            var symDate = symmetrical.convert(new Date(gregDateOrig), 'object');
            var gregDateNew = symmetrical.convert(symDate, 'standard', false);
            expect(gregDateNew).toBe(gregDateOrig);
        });
    });
}
*/

//var symmetrical = require('../js/symmetrical');
var rows = symmetrical.testData;
var total = rows.length;
for (var i = 0; i < total; i++) {
    describe('[+] fixedToSymYear ' + (i + 1) + ' of ' + total, function() {
        it('convert from gregorian back to gregorian', function() {
            var row = rows.shift();
            var symDateOrig = row.defSym454;
            var gregDate = symmetrical.convert(symmetrical.parseSymDateFull(symDateOrig), 'object');
            var symDateNew = symmetrical.convert(gregDate, 'standard', false);
            expect(symDateNew).toBe(symDateOrig);
        });
    });
}
