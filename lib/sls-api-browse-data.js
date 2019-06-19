'use strict';

const { Dispatcher } = require('@janiscommerce/api-view');

class SlsApiBrowseData {

	static getDispatcher(...args) {
		return new Dispatcher(...args); //
	}

	static async handler(event) {

		const { entity } = event.path;

		const dispatcher = this.getDispatcher({
			entity,
			action: 'browse',
			method: 'data'
		});

		const result = await dispatcher.dispatch();

		return {
			statusCode: result.code,
			body: result.body
		};
	}

}

module.exports = SlsApiBrowseData;
