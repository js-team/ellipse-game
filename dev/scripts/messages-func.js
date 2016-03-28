'use strict';

export  default function StateMessage(options) {
	let defaults = {
		elem: jQuery('<div class="msg"></div>'),
		parent: jQuery('body'),
		defaultText: 'Move here to start !',
		progressText: 'Good job !!!',
		errorText: 'Feiled :( Refresh to start !!!',
		successText: 'Winner :)'
	};

	let opt = Object.assign(defaults, options);
	let elem = opt.elem;

	elem.appendTo(opt.parent);

	setText('init');

	function setText(state, msg) {
		switch (state) {
			case 'init':
				elem.text(msg || opt.defaultText).css('background', '#27ba10');
				break;
			case true:
				elem.text(msg || opt.successText).css('background', '#11fc21');
				break;
			case false:
				elem.text(msg || opt.errorText).css('background', '#f00');
				break;
			default:
				elem.text(msg || opt.progressText).css('background', '#00e4e7');
		}
	}

	function hideMsg() {
		elem.hide();
	}

	function showMsg() {
		elem.show();
	}

	return {
		show () {
			showMsg();
		},
		hide () {
			hideMsg();
		},
		setText (state, msg) {
			setText(state, msg);
			return this;
		}
	};
}
