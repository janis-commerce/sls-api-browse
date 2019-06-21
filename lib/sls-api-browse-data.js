'use strict';

const SlsApiBrowse = require('./sls-api-browse');

class SlsApiBrowseData extends SlsApiBrowse {

	static get apiMethod() {
		return 'data';
	}

}

module.exports = SlsApiBrowseData;
