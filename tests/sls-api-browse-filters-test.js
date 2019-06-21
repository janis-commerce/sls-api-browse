'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { ApiResponse } = require('@janiscommerce/sls-api-response');
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

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiBrowseFilters.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {
					'x-foo': 'bar'
				},
				query: {
					sortBy: 'id',
					sortDirection: 'asc'
				}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'filters',
				headers: {
					'x-foo': 'bar'
				},
				data: {
					sortBy: 'id',
					sortDirection: 'asc'
				}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 200,
				body: {
					foo: 'bar'
				}
			});
		});

		it('Should pass the request arguments (without querystring) to the Dispatcher and map the dispatcher result', async () => {

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

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiBrowseFilters.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {
					'x-foo': 'bar'
				}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'filters',
				headers: {
					'x-foo': 'bar'
				},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 200,
				body: {
					foo: 'bar'
				}
			});
		});

		it('Should return an error if the Dispatcher throws', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);

			dispatcherStub.dispatch.throws(new Error('Some error'));

			const getDispatcherStub = sandbox.stub(SlsApiBrowseFilters, 'getDispatcher');
			getDispatcherStub.returns(dispatcherStub);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiBrowseFilters.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'filters',
				headers: {},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 500,
				body: {
					message: 'Some error'
				}
			});
		});

		it('Should return an error with a custom statusCode if the Dispatcher throws with a code', async () => {

			const error = new Error('Some error');
			error.code = 503;

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);
			dispatcherStub.dispatch.throws(error);

			const getDispatcherStub = sandbox.stub(SlsApiBrowseFilters, 'getDispatcher');
			getDispatcherStub.returns(dispatcherStub);

			const apiResponseStub = sandbox.stub(ApiResponse, 'send');
			apiResponseStub.returns('the actual response');

			const apiResponse = await SlsApiBrowseFilters.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, 'the actual response');

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'filters',
				headers: {},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);

			sandbox.assert.calledOnce(apiResponseStub);
			sandbox.assert.calledWithExactly(apiResponseStub, {
				statusCode: 503,
				body: {
					message: 'Some error'
				}
			});
		});
	});

});
