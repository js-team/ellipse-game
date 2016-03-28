// page init
jQuery(function() {
	initGame();
});

function initGame() {
	jQuery('.game').each(function() {
		var holder = jQuery(this);

		new Game({
			svg: holder.find('svg'),
			rotatingArea: holder.find('.svg-ellipse-area'),
			holder: holder.find('.svg-area'),
			minRotateAngle: 10,
			rotateDegRange: 90
		});
	});
}