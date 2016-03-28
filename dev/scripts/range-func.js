'use strict';

export default function Range(options) {
	let defaults = {
		holder: null, // DOM g element
		coordinates: [],
		lineWidth: 5,
		lineHeight: 10,
		rangeAngle: 50,
		color: '#000'
	};

	let opt = Object.assign(defaults, options);

	const START_DEG = 270;
	let rangeRadL = START_DEG - opt.rangeAngle / 2;
	let rangeRadR = START_DEG + opt.rangeAngle / 2;
	let range = [rangeRadL, rangeRadR];

	for (let i = 0; i < range.length; i++) {
		opt.holder.append('line')
			.attr('class', 'line')
			.attr('x1', opt.coordinates[range[i]].x)
			.attr('y1', +opt.coordinates[range[i]].y - opt.lineHeight)
			.attr('x2', opt.coordinates[range[i]].x)
			.attr('y2', +opt.coordinates[range[i]].y + opt.lineHeight)
			.attr('stroke', opt.color)
			.attr('stroke-width', opt.lineWidth);

	}

	return range;
}
