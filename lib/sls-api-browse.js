'use strict';

const awsQs = require('amazon-api-gateway-querystring');

const { Dispatcher } = require('@janiscommerce/api-view');

class SlsApiBrowse {

	static get apiMethod() {
		throw	new Error('apiMethod getter not implemented');
	}

	static getDispatcher(...args) {
		return new Dispatcher(...args); //
	}

	static async handler(event) {

		const { entity } = event.path;

		const data = event.query ? awsQs(event.query) : {};

		const dispatcher = this.getDispatcher({
			entity,
			action: 'browse',
			method: this.apiMethod,
			data,
			headers: event.headers
		});

		try {

			const result = await dispatcher.dispatch();

			return {
				statusCode: result.code,
				body: result.body
			};

		} catch(e) {
			return {
				statusCode: e.code || 500,
				body: {
					message: e.message
				}
			};
		}
	}

}

module.exports = SlsApiBrowse;
