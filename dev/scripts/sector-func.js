'use strict';

export default function Sector(options) {
	let defaults = {
		holder: null,
		figureData: [],
		center: [0, 0],
		sectorWidth: 10,
		sectorColor: '#f00',
		range: [240, 300], // [START_DEG - RANGE_ANGLE / 2, START_DEG + RANGE_ANGLE / 2]
		clipId: ''
	};

	let opt = Object.assign(defaults, options);

	const START_DEG = 270;
	let figureData = opt.figureData;
	let maxVector = figureData[0].v;
	let started = false;
	let stoped = false;

	let clipPathId = opt.clipId ? opt.clipId : 'clip' + Date.now();

	let clipPath = opt.holder.append('clipPath')
			.attr('id', clipPathId);

	let sector = clipPath.append('circle')
			.attr('cx', getFigureCoords(START_DEG).x)
			.attr('cy', getFigureCoords(START_DEG).y)
			.attr('r', opt.sectorWidth);

	// move sector handler
	function moveSector(t) {
		let centerCoords = getFigureCoords(t);
		let lRange = (t - (opt.sectorWidth * maxVector / figureData[opt.range[0]].v) / 4);
		let rRange = (t + (opt.sectorWidth * maxVector / figureData[opt.range[1]].v) / 4);

		if (!started && (t > START_DEG - 1 && t < START_DEG + 1)) {
			started = true;
		}


		if (started) {
			if (lRange > opt.range[0] && rRange < opt.range[1] ) {
				//console.log('good !!!');
			} else {
				stoped = true;
			}

			if (!stoped) {
				sector
					.attr('cx', centerCoords.x)
					.attr('cy', centerCoords.y);
			}
		}

	}

	// reset sector state
	function resetSector() {
		started = false;
		stoped = false;
		sector
			.attr('cx', getFigureCoords(START_DEG).x)
			.attr('cy', getFigureCoords(START_DEG).y);
	}

	/**
	* Get a figure coordinates.
	* @param {number} t - The angle, in degrees
	* @return {number} x - The x value , in pixels.
	* @return {number} y - The y value , in pixels.
	*/
	function getFigureCoords(t) {
		return {
			x: figureData[t].x,
			y: figureData[t].y
		};
	}

	return {
		clipId: clipPathId,
		resetSectorState () {
			resetSector();
		},
		set sectorAngle (t) {
			moveSector(t);
		},
		get started (){
			return started;
		},
		get stoped (){
			return stoped;
		}
	};
}
