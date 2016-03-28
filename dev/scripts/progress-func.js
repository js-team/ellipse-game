'use strict';

export default function ProgressBar(options) {
	let defaults = {
		elem: jQuery('<canvas class="progress-bar" width="300" height="20"></canvas>'),
		parent: jQuery('body'),
		gradient: ['#00e741', '#f00']
	};

	let opt = Object.assign(defaults, options);
	let elem = opt.elem;

	// find elements
	elem.appendTo(opt.parent);

	let ctx = elem.get(0).getContext('2d');
	let gradient = ctx.createLinearGradient(0, 0, elem.width(), 0);
	let progressWidth = 0;

	// create gradient
	gradient.addColorStop(0, opt.gradient[0]);
	gradient.addColorStop(1, opt.gradient[1]);

	// draw progress
	ctx.beginPath();
	ctx.fillStyle = gradient;
	ctx.fillRect(1, 1, progressWidth, elem.height() - 2);
	ctx.strokeRect(0, 0, elem.width(), elem.height());

	// anim progress
	function redrawProgress(value) {
		progressWidth = (elem.width() - 2) * value;
		ctx.fillRect(1, 1, progressWidth, elem.height() - 2);
	}

	return {
		resetProgress () {
			ctx.clearRect(1, 1, elem.width() - 2, elem.height() - 2);
		},
		animProgress (value) {
			redrawProgress(value);
		}
	};
}
