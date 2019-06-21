'use strict';

const SlsApiBrowse = require('./sls-api-browse');

class SlsApiBrowseFilters extends SlsApiBrowse {

	static get apiMethod() {
		return 'filters';
	}

}

module.exports = SlsApiBrowseFilters;
