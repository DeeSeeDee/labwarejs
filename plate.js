var Microplate = function (options){
	
	/*
		This represents an SBS-standard microplate.
		It defaults to a 96-well plate, but anything from a 6-well 
		to a 3456-well plate can be represented.
		Users can opt for circular, square, or rounded-square well
		shapes.
	*/
	
	var maxWidth = 1800;
	
	options = options || {};
	
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
	this.colIteratorType = (['letter', 'number'].indexOf(options.colIterator) !== -1 
		? options.rowIterator : 'number');
	this.wellShape = options.wellShape || 'square';
	this.wellGap = parseInt(options.wellGap, 5) || 5;

	/*
		The width along with the padding and margin 
		determines the height dimension
	*/

	this.margin = parseInt(options.margin, 10) || 10;
	this.padding = parseInt(options.padding, 10) || 10;
		
	if(this.padding >= 20 && options.annotations){
		this.annotations = true;
	}
		
	this.width = parseInt(options.width, 10) || 1000;
	this.width = this.width > maxWidth ? maxWidth : this.width;
	this.segmentSize = (this.width - (2 * this.padding) - 
		(2 * this.margin) - (this.columns * this.wellGap)) / this.columns;
	this.height = ((this.segmentSize * this.rows) + (this.rows * this.wellGap) 
		+ (2 * this.margin) + (2 * this.padding));
	this.wells = [];
	
	this.buildWells();
	
	this.attributes = (options.attributes 
		&& typeof options.attributes === 'object' 
		&& typeof options.attributes !== 'null') ? options.attributes : {
		class: 'plate'
	};
	
	if(!Object.keys(this.attributes).indexOf('class') === -1){
		this.attributes['class'] = 'plate';
	}
	
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
					i + (i * (this.columns - 1)) + j,
					{ 
						shape: this.wellShape,
						padding: this.wellGap,
						color: this.wellColor
					});
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

Microplate.prototype.render = function(){
	var self = this;
	var $plate = $('<svg xmlns="http://www.w3.org/2000/svg" class="microplate">')
		.attr('width', this.width).attr('height', this.height);
	Object.keys(this.attributes).forEach(function(attrib){
		$plate.attr(attrib, self.attributes[attrib]);
	});
	var $plateG = $('<g>');
	var $plateRect = $('<rect>').attr('width', this.width - (2 * this.margin))
		.attr('height', this.height - (2 * this.margin))
		.attr('x', this.margin).attr('y', this.margin)
		.attr('class', 'plate');
	$plateG.append($plateRect);
	for(var i = 0; i < this.rows; i++){
		if(this.annotations){
			$plateG.append($('<text>').attr('fill', this.annotationColor)
				.attr('y', (this.segmentSize * i) + (this.wellGap * i) + this.margin + this.padding + this.segmentSize / 1.8)
				.attr('x', this.padding / 1.6)
				.attr('class', 'annotation')
				.text(this.wells[i][0].row));
		}
		for(var j = 0; j < this.columns; j++){
			if(i === 0 && this.annotations){
				$plateG.append($('<text>').attr('fill', this.annotationColor)
					.attr('x', (this.segmentSize * j) + (this.wellGap * j) + this.margin + this.padding+ this.segmentSize / 2.6)
					.attr('y', this.padding)
					.attr('class', 'annotation')
					.text(this.wells[0][j].col));
			}
			var attribs = {
				xoffset: (this.segmentSize * j) + this.margin + this.padding + (this.wellGap * j),
				yoffset: (this.segmentSize * i) + this.margin + this.padding + (this.wellGap * i),
				size: this.segmentSize
			};
			$plateG.append(this.wells[i][j].render(attribs));
		}
	}
	$plate.append($plateG);
	return $plate[0].outerHTML;
}