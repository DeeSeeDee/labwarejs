$(function(){
	
	test( "Sanity Check", function() {
		ok(4 % 2 === 0, "Two is an even number." );
	});

	module("Plate/Well Generation");
	test("Default 96-Well Microplate", function(){
		var plate = new Microplate();
		var arrayOfWells = plate.getWellsByCoordinates(
			['A01', 'C05', 'E06', 'D11', 'J19']); //threw in a bogus well;
		var wellsByRange = plate.getWellsByCoordinateRange('C03:E12');
		var wellsByGoofyRange = plate.getWellsByCoordinateRange('F03:D05');
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
		equal(arrayOfWells.length, 4, 'Properly retrieve group of coordinates.');
		equal(arrayOfWells[3].coordinate, 'D11', 
			'Coordinate group is in expected order');
		equal(arrayOfWells[0].coordinate, 'A01', 
			'Coordinate group is in expected order');
		equal(wellsByRange.length, 34, 'Well range returns the expected count');
		equal(wellsByRange[0].coordinate, 'C03', 
			'Well range returns wells in the expected order');
		equal(wellsByRange[33].coordinate, 'E12', 
			'Well range returns wells in the expected order');
		equal(wellsByRange[30].coordinate, 'E09', 
			'Well range returns wells in the expected order');
		equal(wellsByGoofyRange.length, 23, 
			'Reverse well range returns the expected count');
		equal(wellsByGoofyRange[0].coordinate, 'D05', 
			'Well range returns wells in the expected order');
		equal(wellsByGoofyRange[22].coordinate, 'F03', 
			'Well range returns wells in the expected order');
		equal(wellsByGoofyRange[10].coordinate, 'E03', 
			'Well range returns wells in the expected order');
		equal(plate.getWellByIndex(90, true).coordinate, 'H06', 
			'getWellByIndex works properly when one-based');
		
		deepEqual(plate.getWellByCoordinate('I55'), undefined, 'expected value from bogus well');
	});
	
	test("384-Well Plate", function(){
		var plate = new Microplate({
			rows: 16,
			columns: 24
		});
		equal(plate.getWellByIndex(359).coordinate, 'O24', 'getWellByIndex method works properly.');
	});
	
	module("Well-specific tests");
	test('Volume', function(){
		var emptyWell = new Well('A', '01', 0);
		var fullWell = new Well('A', '01', 0, {
			volume: 50,
			maxVolume: 50
		});
		var well = new Well('A', '01', 0, {
			volume: 15,
			maxVolume: 60
		});
		deepEqual(emptyWell.empty, true, 
			'A well initialized without any volume data is considered empty.');
		deepEqual(emptyWell.full, false, 
			'A well initialized without any volume data is not considered full.');
		deepEqual(fullWell.empty, false,
			'A well intialized with max volume is not considered empty.')
		deepEqual(fullWell.full, true,
			'A well intialized with max volume is considered full.')
		deepEqual(well.empty, false,
			'A well initialized with nonzero, nonmax volume is not considered empty.');
		deepEqual(well.full, false,
			'A well initialized with nonzero, nonmax volume is not considered full.');
		well.addVol(45);
		deepEqual(well.full, true,
			'After adding right up to the capacity, well is considered full.');
		equal(well.volume, 60,
			'Volume is as expected after adding volume.');
		well.addVol(5);
		deepEqual(well.full, true,
			'After adding above the capacity, well is considered full.');
		equal(well.volume, 60,
			"Volume doesn't go above capacity.");
		well.removeVol(5);
		deepEqual(well.full, false,
			'After removing a fraction of the volume from a full well, well is not considered full.');
		deepEqual(well.empty, false, 
			'After removing a fraction of the volume from a full well, well is not considered empty.');
		equal(well.volume, 55,
			"Volume doesn't go above capacity.");
		well.removeVol(55);
		deepEqual(well.empty, true,
			'After removing the full volume, well is considered empty.');
		equal(well.volume, 0,
			'Volume is accurately represented after subtracting the entire amount');
		well.removeVol(5);
		deepEqual(well.empty, true,
			'After attempting to remove volume from an empty well, well is considered empty.');
		equal(well.volume, 0,
			'Volume is accurately represented after subtracting from an empty well.');
	});
	
	test('Coordinates', function(){
		var numberCoordsWell = new Well('1', '25', 200);
		equal(numberCoordsWell.coordinate, '1,25', 
			'Numerical coordinates are shown with a comma.');
	});
});