var Flowcell = function(options){

	/*
		This represents an Illumina-type flowcell.
		As Illumina flowcells have multiple lane
		configurations, so this prototype allows for 
		any number of lanes.
		
		Right now the lanes are one-dimensional
		in accordance with Illumina technology.
	*/
	
	options = options || {};
	
	//default to classic 8-lane flowcell
	this.lanes = [];
	
	for(var i = 1; i <= parseInt(options.lanes, 10); i++){
		this.lanes.push( new Lane({
			number: i
		}));
	}
	
	/*
		since a flowcell can be safely be represented as
		one-dimensional in most contexts, the height will
		be used to determine the width.
		Technically, the flowcells differ in their actual dimensions
		but for simplicity's sake they will look the same, with the 
		lanes clearly demarcated.
	*/
	
	//Height is the primary determinant for rendering
	this.height = options.height || 800;
	this.width = this.height / 4;
	this.margin = parseInt(options.margin, 10) || 10;
	this.padding = parseInt(options.padding, 10) || 5;
	this.laneGap = parseInt(options.laneGap, 10) || 2;
	//"Annotations" means putting the lane number above the start of each lane.
	if(this.padding >= 20 && options.annotations){
		this.annotations = true;
		this.annotationColor = options.annotationColor || 'white';
	}
	this.laneWidth = (this.width - (2 * this.padding) -
		(2 * this.margin) - ((this.lanes.length - 1) 
		* this.laneGap))/this.lanes.length;
}

Flowcell.prototype.render = function(){
	var self = this;
	var $flowcell = $('<svg xmlns="http://www.w3.org/2000/svg" class="flowcell">')
		.attr('width', this.width).attr('height', this.height);
	var $flowcellG = $('<g>');
	$flowcellG.append($('<rect>').attr('width', this.width - (2 * this.margin))
		.attr('height', this.height - (2 * this.margin))
		.attr('x', this.margin).attr('y', this.margin)
		.attr('stroke', 'black').attr('fill', this.backgroundColor)
		.attr('class', 'fc_surface'));
	this.lanes.forEach(function(lane, index){
		var attribs = {
			width: self.laneWidth,
			height: self.height - (self.padding * 2) - (self.margin * 2),
			xoffset: self.padding + self.margin + (index * self.laneWidth) + (index * self.laneGap),
			yoffset: self.padding + self.margin
		};
		$flowcellG.append(lane.render(attribs));
		if(self.annotations){
			$flowcellG.append($('<text>').attr('fill', self.annotationColor)
				.attr('y', self.margin/2 + self.padding)
				.attr('x', self.margin + self.padding + (index * self.laneWidth) + (index * self.laneGap) + self.laneWidth/4)
				.attr('class', 'annotation')
				.text(lane.number.toString()));
		}
	});
	$flowcell.append($flowcellG);
	return $flowcell[0].outerHTML;
}