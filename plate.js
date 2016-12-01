var Microplate = function (options){
	
	/*
		This represents an SBS-standard microplate.
		It defaults to a 96-well plate, but anything from a 6-well 
		to a 3456-well plate can be represented.
		Users can opt for circular, square, or rounded-square well
		shapes.
	*/
	
	options = options || {};

	var maxWidth = 1000;
	var maxHeight = 750;
	
	//default to 96-Well
	this.rows = parseInt(options.rows, 10) || 8;
	this.columns = parseInt(options.columns, 10) || 12;
	['rows', 'columns'].forEach(function(dim){
		if(this[dim] > 702){
			//Constrain dimensions to something reasonable
			this[dim] = 702;
		}
	});
	this.shape = (['square', 'rounded', 'circle'].indexOf(options.shape) !== -1 
		? options.shape : 'circle');
	this.rowIteratorType = (['letter', 'number'].indexOf(options.rowIterator) !== -1 
		? options.rowIterator : 'letter');
	this.colIteratorType = (['letter', 'number'].indexOf(options.rowIterator) !== -1 
		? options.rowIterator : 'number');

	this.segmentSize = //do math;
	this.wells = [];
	
	this.buildWells();
	
	Object.defineProperty(this, 'wellList', {
		get: function(){
			var wells = [];
			this.wells.forEach(function(row){
				row.forEach(function(col){
					wells.push(col);
				});
			})
			return wells;
		}
	});
	
};

Microplate.prototype.buildWells = function(){
	/*
		Well indices go from upper left to lower right in a Z-pattern
		So on an SBS-standard 96-well plate, Well B03 which is the second 
		row from the top and the third column from the left, the index would
		be 15.
	*/
	for(var i = 0; i < this.rows; i++){
		this.wells[i] = [];
		for(var j = 0; j < this.columns; j++){
			this.wells[i][j] = 
				new Well(
					this.getIterator(this.rowIteratorType).apply(this, [i, this.rows]), 
					this.getIterator(this.colIteratorType).apply(this, [j, this.columns]),
					i + (i * (this.columns - 1)) + j);
		}
	}
}

Microplate.prototype.getIterator = function(iteratorType){
	switch(iteratorType){
		case "letter":
			return this.LetterIterator;
			break;
		case "number":
			return this.NumberIterator;
			break;
		default:
			return this.NumberIterator;
			break;
	}
}

Microplate.prototype.getWellByCoordinate = function(coordinate){
	return this.wellList.filter(function(well){
		return well.coordinate.toLowerCase() === coordinate.toLowerCase();
	})[0];
}

Microplate.prototype.getWellsByCoordinateRange = function(coordinateRange){
	/*
		Take a coordinate range in the following format:
		start:finish (example A02:B10)
		and return an array of Well objects
	*/
	var self = this;
	var coords = coordinateRange.split(':');
	if(coords.length !== 2){
		return [];
	}
	//convert coordinates to indices and sort in ascending order
	coords = coords.map(function(coord){
		return self.getWellByCoordinate(coord).index;
	}).sort(function(a, b){
		return a - b;
	});
	var wells = [];
	for(var i = coords[0]; i <= coords[1]; i++){
		wells.push(this.getWellByIndex(i));
	}
	return wells;
}

Microplate.prototype.getWellsByCoordinates = function(coordinateArray){
	/*
		Take an array of coordinates and return an array of the 
		corresponding Well objects
	*/
	var self = this;
	if(!Array.isArray(coordinateArray)){
		return [];
	}
	var wells = [];
	coordinateArray.forEach(function(coord){
		var foundWell = self.getWellByCoordinate(coord);
		if(foundWell){
			wells.push(foundWell);
		}
	});
	return wells;
}

Microplate.prototype.getWellByIndex = function(index, oneOffset){
	//oneOffset means using a 1-based index instead of the 0-based default
	index = parseInt(index, 10);
	if(oneOffset){
		index -= 1;
	}
	if(!index || index < 0){
		return;
	}
	return this.wellList.filter(function(well){
		return well.index === index;
	})[0];
}

Microplate.prototype.LetterIterator = function(iterNum){
	var inProgress = '';
	while(iterNum >= 26){
		var thisIter = Math.floor((iterNum)/26) - 1;
		inProgress += String.fromCharCode(thisIter + 65);
		iterNum -= (26 * (thisIter + 1));
	}
	inProgress += String.fromCharCode(iterNum + 65);
	return inProgress;
}

Microplate.prototype.NumberIterator = function(num, max){
	return this.zeroPad(num + 1, max.toString().length);
}

Microplate.prototype.zeroPad = function(num, numPlaces) {
	num = num + '';
	return num.length >= numPlaces ? num : new Array(numPlaces - num.length + 1).join('0') + num;
}