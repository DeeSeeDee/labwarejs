$(function(){
	
	test( "Sanity Check", function() {
		ok(4 % 2 === 0, "Two is an even number." );
	});

	module("Plate/Well Generation");
	test("Default 96-Well Plate", function(){
		var plate = new Plate();
		equal(plate.rows, 8, "Plate has eight rows.");
		equal(plate.columns, 12, "Plate has twelve columns.");
		equal(plate.wells[0][0].coordinate, 'A01', 'Well at 0,0 is A01');
		equal(plate.wells[7][11].coordinate, 'H12', 'Well at 7,11 is H12');
		equal(plate.getWellByCoordinate('B09').coordinate, 'B09', 
			'getPlateCoordinate prototype method');
		equal(plate.getWellByCoordinate('e11').coordinate, 'E11', 
			'case sensitivity of getPlateCoordinate method');
		equal(plate.getWellByIndex(93).coordinate, 'H10', 
			'getWellByIndex works properly');
		equal(plate.getWellByIndex(90, true).coordinate, 'H06', 
			'getWellByIndex works properly when one-based');
		deepEqual(plate.getWellByCoordinate('I55'), undefined, 'expected value from bogus well');
	});
	
	test("384-Well Plate", function(){
		var plate = new Plate({
			rows: 16,
			columns: 24
		});
		equal(plate.getWellByIndex(359).coordinate, 'O24', 'getWellByIndex method works properly.');
	});
});