var Lane = function(options){

	/*
		This represents a lane for an Illumina flowcell.
		Conceptually it will be one-dimensional.		
	*/
	
	options = options || {};
	
	this.number = parseInt(options.number, 10);
	
	/*
		The notion of clusters allows a lane to be "empty" or "populated"
		with a sequencing library or pool. The usage of this feature is optional.
	*/
	this.clusters = parseInt(options.clusters, 10) || 0;
	this.maxClusters = parseInt(options.maxClusters, 10) || false;
	
	/*
		Illumina lanes have surfaces and tiles. These can optionally be
		passed in during construction. Visually I don't have anything in mind
		for these right now, but I'm putting them in as a stub for future work.
	*/
	this.surfaces = parseInt(options.surfaces, 10) || false;
	this.tiles = parseInt(options.tiles, 10) || false;
	this.swaths = parseInt(options.swaths, 10) || false;

	this.color = options.color || 'white';
	
	Object.defineProperty(this, 'overClustered', {
		get: function(){
			if(!this.maxClusters){
				return false;
			}
			return this.clusters > this.maxClusters;
		}
	});
	
	Object.defineProperty(this, 'percentFull', {
		get: function(){
			if(!this.maxClusters || !this.clusters){
				return 0;
			}
			if(this.overClustered){
				return 1;
			}
			return this.clusters/this.maxClusters;
		}
	});
	
	Object.defineProperty(this, 'totalTiles', {
		get: function(){
			if(!this.surfaces || !this.tiles){
				return false;
			}
			return this.surfaces * this.tiles * this.swaths;
		}
	});
}

Lane.prototype.render = function(attribs){
	return $('<rect>').attr('width', attribs.width).attr('height', attribs.height)
				.attr('x', attribs.xoffset).attr('y', attribs.yoffset)
				.attr('stroke', 'black').attr('fill', this.color).attr('class', 'lane');
}