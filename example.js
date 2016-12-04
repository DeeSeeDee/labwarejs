$(function(){
	var plate = new Microplate({
		padding:30,
		annotations: true
	});
	$('#test').append(plate.render())
});