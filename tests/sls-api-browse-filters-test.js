'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { Dispatcher } = require('@janiscommerce/api-view');

const { SlsApiBrowseFilters } = require('..');

describe('SlsApiBrowseFilters', () => {

	describe('getDispatcher', () => {

		it('Should throw when correct params are not given', () => {
			assert.throws(() => SlsApiBrowseFilters.getDispatcher());
		});

		it('Should return a Dispatcher instance when correct params are given', () => {

			const dispatcher = SlsApiBrowseFilters.getDispatcher({
				entity: 'some-entity',
				action: 'some-action',
				method: 'some-method'
			});

			assert(dispatcher instanceof Dispatcher);
		});

	});

	describe('Handler', () => {

		afterEach(() => {
			sandbox.restore();
		});

		it('Should pass the request arguments to the Dispatcher and map the dispatcher result', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);

			dispatcherStub.dispatch.resolves({
				code: 200,
				body: {
					foo: 'bar'
				},
				extraProp: 'more foo'
			});

			const getDispatcherStub = sandbox.stub(SlsApiBrowseFilters, 'getDispatcher');

			getDispatcherStub.returns(dispatcherStub);

			const apiResponse = await SlsApiBrowseFilters.handler({
				path: {
					entity: 'some-entity'
				}
			});

			assert.deepStrictEqual(apiResponse, {
				statusCode: 200,
				body: {
					foo: 'bar'
				}
			});

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'filters'
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);
		});
	});

});
