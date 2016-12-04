var Well = function(row, col, index, options){

	/*
		A "well" models a microplate well.
		It includes conceptual functions for managing 
		well volume
	*/

	options = options || {};

	this.row = row;
	this.col = col;
	this.index = index;
	
	this.maxVolume = parseInt(options.maxVolume, 10);
	this.volume = parseInt(options.volume, 10);
	
	this.padding = parseInt(options.padding, 10) || 5;
	this.color = options.color || 'white';
	
	switch(options.shape){
		case 'circle':
			this.shape = 'circle'
			break;
		case 'rounded':
			this.shape = 'rounded';
			break;
		default:
			this.shape = 'square';
			break;
	}
	
	Object.defineProperty(this, 'coordinate', {
		get: function(){
			if(
				[this.row, this.col].every(function(coord){
					return parseInt(coord, 10);
				})
			){
				return this.row + ',' + this.col;
			}
			return this.row + this.col;
		}
	});
	
	Object.defineProperty(this, 'empty', {
		get: function(){
			return !this.volume;
		}
	});
	
	Object.defineProperty(this, 'full', {
		get: function(){
			return this.volume === this.maxVolume;
		}
	});
}

Well.prototype.removeVol = function(vol){
	this.volume -= vol;
	if(this.volume < 0){
		this.volume = 0;
	}
}

Well.prototype.addVol = function(vol){
	this.volume += vol;
	if(this.volume > this.maxVolume){
		this.volume = this.maxVolume;
	}
}

Well.prototype.render = function(attribs){
	switch(this.shape){
		case 'rounded':
			var radius = attribs.size * 0.05;
			var size = attribs.size;
			return $('<rect>').attr('rx', radius).attr('ry', radius).attr('width', size).attr('height', size)
				.attr('x', attribs.xoffset).attr('y', attribs.yoffset).attr('stroke', 'black').attr('fill', this.color);
		case 'circle':
			var radius = attribs.size / 2;
			return $('<circle>').attr('r', radius).attr('cx', attribs.xoffset + radius).attr('cy', attribs.yoffset + radius)
				.attr('stroke', 'black').attr('fill', this.color);
		default:
			var radius = attribs.size * 0.05;
			var size = attribs.size;
			return $('<rect>').attr('width', size).attr('height', size)
				.attr('x', attribs.xoffset).attr('y', attribs.yoffset).attr('stroke', 'black').attr('fill', this.color);
	}
}