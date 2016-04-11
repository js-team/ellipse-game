'use strict';

export let mathLib = {
	// Converts from degrees to radians.
	deg2rad: (deg) => deg * Math.PI / 180,

	// Converts from radians to degrees.
	rad2deg: function(radians) {
		return radians * 180 / Math.PI;
	},

	// get random int
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	/**
	* Get a vector length (Polar form relative to center).
	* @param {number} fi - The angular coordinate Fi measured from the major axis (in radians)
	* @param {number} a - The big ellipse radius.
	* @param {number} b - The small ellipse radius.
	* @return {number} ro - The ro value (vector length , in pixels).
	*/
	getVectorLength(fi, a, b) {
		var cos2fi = (1 + Math.cos(2 * fi)) / 2;
		var sin2fi = (1 - Math.cos(2 * fi)) / 2;

		return a * b / Math.sqrt(Math.pow(b, 2) * cos2fi + Math.pow(a, 2) * sin2fi);
	},

	/**
	* Get a circle coordinates.
	* @param {number} t - The angle, in radians
	* @param {number} r - The circle radius , in pixels.
	* @return {number} x - The x value , in pixels.
	* @return {number} y - The y value , in pixels.
	*/
	getCircleCoords: function(t, r) {
		return {
			x: r * Math.cos(t),
			y: r * Math.sin(t)
		};
	},

	/**
	* Get sine (Pythagorean theorem).
	* @param {number} a - The side a of right triangle, in pixels
	* @return {number} b - The side b of right triangle, in pixels
	* @return {number} sinT - The sine of the angle from ellipse center.
	*/
	getSin: (a, b) => Math.abs(b) / Math.sqrt((Math.pow(a, 2) + Math.pow(b, 2)))
}