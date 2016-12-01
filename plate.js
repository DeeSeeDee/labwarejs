var Plate = function(options){

	options = options || {};

	var maxWidth = 1000;
	var maxHeight = 750;
	
	//default to 96-Well
	this.rows = parseInt(options.rows, 10) || 8;
	this.columns = parseInt(options.columns, 10) || 12;
	['rows', 'columns'].forEach(function(dim){
		if(this[dim] > 702){
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
}

Plate.prototype.buildWells = function(){
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
					this.getIterator(this.rowIteratorType).apply(null, [i, this.rows]), 
					this.getIterator(this.colIteratorType).apply(null, [j, this.columns]),
					i + (i * (this.columns - 1)) + j);
		}
	}
}

Plate.prototype.getIterator = function(iteratorType){
	switch(iteratorType){
		case "letter":
			return LetterIterator;
			break;
		case "number":
			return NumberIterator;
			break;
		default:
			return NumberIterator;
			break;
	}
}

Plate.prototype.getWellByCoordinate = function(coordinate){
	return this.wellList.filter(function(well){
		return well.coordinate.toLowerCase() === coordinate.toLowerCase();
	})[0];
}

Plate.prototype.getWellByIndex = function(index, oneOffset){
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

function LetterIterator(iterNum){
	var inProgress = '';
	while(iterNum >= 26){
		var thisIter = Math.floor((iterNum)/26) - 1;
		inProgress += String.fromCharCode(thisIter + 65);
		iterNum -= (26 * (thisIter + 1));
	}
	inProgress += String.fromCharCode(iterNum + 65);
	return inProgress;
}

function NumberIterator(num, max){
	return zeroPad(num + 1, max.toString().length);
}

function zeroPad(num, numPlaces) {
	num = num + '';
	return num.length >= numPlaces ? num : new Array(numPlaces - num.length + 1).join('0') + num;
}