let MathLib = require('./common.js').mathLib;

'use strict';

export  default function Ellipse(options) {

	let defaults = {
		svg: 'svg#ellipse',
		radius: [], // [250, 175]
		lineWidth: 10,
		color: '#fff200',
		clipId: ''
	};

	let opt = Object.assign(defaults, options);

	let GroupObj = (function() {
		let svgElem = jQuery(opt.svg);
		let svgDom = opt.svg.get(0);
		let r1 = opt.radius[0] || (svgElem.width() - opt.lineWidth) / 2;
		let r2 = opt.radius[1] || (svgElem.height() - opt.lineWidth) / 2;
		let center = [(r1 + opt.lineWidth / 2), (r2 + opt.lineWidth / 2)];

		let group = d3.select(svgDom).append('g')
			.attr('transform', `translate(${center[0]},${center[1]})`);

		let ellipse = group.append('ellipse')
			.attr('rx', r1)
			.attr('ry', r2)
			.attr('stroke', opt.color)
			.attr('stroke-width', opt.lineWidth)
			.attr('fill', 'transparent')
			.attr('clip-path', opt.clipId ? `url(#${opt.clipId})` : '');

		return {
			r1,
			r2,
			center,
			group,
			ellipse
		};
	}());

	let ellipseData = [];

	// get ellipse points
	for (let fi = 0; fi <= 360; fi++) {
		let angleRad = MathLib.deg2rad(fi);
		let v = MathLib.getVectorLength(angleRad, GroupObj.r1, GroupObj.r2);
		let x = parseInt(v * Math.cos(angleRad));
		let y = parseInt(v * Math.sin(angleRad));

		ellipseData.push({x, y, v});
	}

	return {
		obj: GroupObj,
		data: ellipseData
	};
}



