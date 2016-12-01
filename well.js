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