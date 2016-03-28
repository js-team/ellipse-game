'use strict';

let MathLib = require('./common.js').mathLib;

import Ellipse from './ellipse-func.js';
import StateMessage from './messages-func.js';
import Range from './range-func.js';
import ProgressBar from './progress-func.js';
import Sector from './sector-func.js';

export default function Game(options) {

	let defaults = {
		svg: jQuery('.svg-ellipse'),
		rotatingArea: jQuery('.svg-ellipse-area'),
		holder: jQuery('.svg-area'),
		progress: jQuery('.progress-holder'),
		minRotateAngle: 10,
		rotateDegRange: 20,
		ellipse: {
			lineWidth: 8
		},
		sectorEllipse: {
			lineWidth: 8,
			color: '#f00'
		},
		sector: {
			width: 30
		},
		range: {
			angle: 80
		},
		levels: [
			{
				speed: 15000,
				duration: 10000
			},
			{
				speed: 10000,
				duration: 15000
			},
			{
				speed: 8000,
				duration: 20000
			}
		]
	};

	let opt = Object.assign(defaults, options);

	let {rotatingArea, holder, progress, svg} = opt;
	const startRoteteDeg = 0;
	let timer = null;
	let canMove = true;
	let currentRoteteDeg = startRoteteDeg;
	let prevPageX = 0;
	let prevPageY = 0;
	let clipId = 'circle' + Date.now();
	let currLevel = holder.data('level') - 1 || 0;

	// create base ellipse
	let ellipse = Ellipse({
		svg: svg,
		lineWidth: opt.ellipse.lineWidth
	});

	// create sector ellipse
	let sectorEllipse = Ellipse({
		svg: svg,
		lineWidth: opt.sectorEllipse.lineWidth,
		color: opt.sectorEllipse.color,
		clipId: clipId
	});

	// create range
	let range = new Range({
		holder: ellipse.obj.group,
		coordinates: ellipse.data,
		rangeAngle: opt.range.angle
	});

	// create sector
	let sector = Sector({
		holder: sectorEllipse.obj.group,
		figureData: ellipse.data,
		clipId: clipId,
		range: range,
		sectorWidth: opt.sector.width
	});

	// create status message
	let msg = StateMessage({
		parent: holder
	});

	// create progress
	let progressBar = ProgressBar({
		parent: progress
	});

	let direction = MathLib.getRandomInt(0, 1);
	let newRotateAngle = MathLib.getRandomInt(
		getDegRange(direction, currentRoteteDeg)[0],
		getDegRange(direction, currentRoteteDeg)[1]
	);
	let startRotate = false;

	// initial rotate area
	rotatingArea.css('transform', `rotate(${currentRoteteDeg}deg)`);

	// rotate ellipse area
	function rotateArea() {
		startRotate = true;

		let d = jQuery.Deferred();

		let startDirectionTime = Date.now();
		let startGameTime = Date.now();

		let step = function() {
			// rotate area
			rotatingArea.css('transform', `rotate(${currentRoteteDeg}deg)`);

			let directionProgress = Date.now() - startDirectionTime;
			let gameProgress = Date.now() - startGameTime;

			d.notify(gameProgress);

			if (gameProgress > opt.levels[currLevel].duration) {
				d.resolve('success');
				return;
			}

			if (sector.stoped) {
				d.reject('error');
				return;
			}

			if (directionProgress >= opt.levels[currLevel].speed / 360) {
				d.notify(gameProgress, currentRoteteDeg);

				if (Object.is(currentRoteteDeg % 360, newRotateAngle)) {
					direction = MathLib.getRandomInt(0, 1);
					newRotateAngle = MathLib.getRandomInt(
						getDegRange(direction, currentRoteteDeg)[0],
						getDegRange(direction, currentRoteteDeg)[1]
					);
				}

				if (direction > 0) {
					currentRoteteDeg++;
				} else {
					currentRoteteDeg--;
				}

				startDirectionTime = Date.now();
			}

			timer = requestAnimationFrame(step);
		};

		timer = requestAnimationFrame(step);

		return d;
	}

	function getDegRange(direction, currentRoteteDeg = startRoteteDeg) {
		let from = direction > 0 ? currentRoteteDeg + opt.minRotateAngle : currentRoteteDeg - opt.rotateDegRange;
		let to = direction > 0 ? currentRoteteDeg + opt.rotateDegRange : currentRoteteDeg - opt.minRotateAngle;

		return [from, to];
	}

	// get rotate angle on mouse move
	function getRotateAngle(e) {
		let pageX = e && e.pageX || prevPageX;
		let pageY = e && e.pageY || prevPageY;

		let cX = holder.offset().left + holder.width() / 2;
		let cY = holder.offset().top + holder.width() / 2;
		let x = cX - pageX;
		let y = cY - pageY;
		let sinT = 0;
		let tS = 0;

		// dont change this part!!
		if (cY > pageY) {
			if (cX < pageX) {
				sinT = MathLib.getSin(x, y);
				tS = 0;
			} else {
				sinT = MathLib.getSin(y, x);
				tS = Math.PI / 2;
			}
		} else {
			if (cX < pageX) {
				sinT = MathLib.getSin(y, x);
				tS = 3 * Math.PI / 2;
			} else {
				sinT = MathLib.getSin(x, y);
				tS = Math.PI;
			}
		}

		// angle in radians
		let rotRad = 2 * Math.PI - (tS + Math.asin(sinT)) - MathLib.deg2rad(currentRoteteDeg % 360);

		// calc correct angle in radians
		rotRad = rotRad < 0 ? 2 * Math.PI + rotRad : rotRad > 2 * Math.PI ? rotRad - 2 * Math.PI : rotRad;

		prevPageX = pageX;
		prevPageY = pageY;

		return parseInt(MathLib.rad2deg(rotRad)); // angle in degrees
	}

	// move handler
	function moveHandler(e) {
		if (!canMove) return;

		let t = getRotateAngle(e);

		sector.sectorAngle = t;

		if (!startRotate && sector.started) {
			rotateArea()
				.done(onSuccess)
				.fail(onError)
				.progress(onProgress);
		}

	}

	// game success
	function onSuccess() {
		canMove = false;

		msg.setText(true).show();

		onEnd(true);
	}

	// game failed
	function onError() {
		canMove = false;

		msg.setText(false).show();

		onEnd();
	}

	// game end
	function onEnd(nextLevel) {
		jQuery(document).off('mouseenter mousemove', moveHandler);
		cancelAnimationFrame(timer);
		timer = null;

		if (nextLevel) {
			if (currLevel < opt.levels.length - 1) {
				canMove = true;
				currLevel++;
				resetLevel();
			} else {
				endLevels();
			}
		}
	}

	// game progress
	function onProgress(progress, currentRoteteDeg) {
		msg.setText().show();

		// animate progress
		progressBar.animProgress(progress / opt.levels[currLevel].duration);

		// move point
		moveHandler();
	}

	// reset level
	function resetLevel(fromInit) {
		startRotate = false;
		currentRoteteDeg = startRoteteDeg;
		direction = MathLib.getRandomInt(0, 1);
		newRotateAngle = MathLib.getRandomInt(
			getDegRange(direction, currentRoteteDeg)[0],
			getDegRange(direction, currentRoteteDeg)[1]
		);

		rotatingArea.stop().animate({
			opacity: 0
		}, fromInit ? 0 : 1000, () => {
			msg.setText('init', `Round  ${(currLevel + 1)}`).show();
			sector.resetSectorState();
			progressBar.resetProgress();

			rotatingArea.css('transform', `rotate(${currentRoteteDeg}deg)`);

			rotatingArea.animate({
				opacity: 1
			}, 1000, () => {
				msg.setText('init');
				jQuery(document).on('mouseenter mousemove', moveHandler);
			});
		});

	}

	// end level
	function endLevels() {
		msg.setText('init', 'Game is over !! :))))').show();

		rotatingArea.stop().animate({
			opacity: 0
		}, 1000);
	}

	// initial state
	resetLevel(true);
}
