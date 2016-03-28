global.jQuery = require('jquery');
global.raf = require('./lib/requestanimationframe.js');
let d3 = require('d3');

import Game from './game-func.js';

//page init
jQuery(function() {
	let holder = jQuery('.game');

	Game({
		svg: holder.find('svg'),
		rotatingArea: holder.find('.svg-ellipse-area'),
		holder: holder.find('.svg-area'),
		minRotateAngle: 10,
		rotateDegRange: 90
	});
});
