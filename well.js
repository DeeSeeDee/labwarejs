var Well = function(row, col, index){
	this.row = row;
	this.col = col;
	this.index = index;
	
	Object.defineProperty(this, 'coordinate', {
		get: function(){
			return this.row + this.col;
		}
	});
}