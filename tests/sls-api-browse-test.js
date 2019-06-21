'use strict';

const assert = require('assert');

const SlsApiBrowse = require('../lib/sls-api-browse');

describe('SlsApiBrowse', () => {

	describe('apiMethod getter', () => {

		it('Should throw when it\'s not overriden', () => {
			assert.throws(() => SlsApiBrowse.apiMethod, {
				message: 'apiMethod getter not implemented'
			});
		});
	});
});
