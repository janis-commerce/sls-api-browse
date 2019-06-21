'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const { Dispatcher } = require('@janiscommerce/api-view');

const { SlsApiBrowseData } = require('..');

describe('SlsApiBrowseData', () => {

	describe('getDispatcher', () => {

		it('Should throw when correct params are not given', () => {
			assert.throws(() => SlsApiBrowseData.getDispatcher());
		});

		it('Should return a Dispatcher instance when correct params are given', () => {

			const dispatcher = SlsApiBrowseData.getDispatcher({
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

			const getDispatcherStub = sandbox.stub(SlsApiBrowseData, 'getDispatcher');

			getDispatcherStub.returns(dispatcherStub);

			const apiResponse = await SlsApiBrowseData.handler({
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
				method: 'data',
				headers: {
					'x-foo': 'bar'
				},
				data: {
					sortBy: 'id',
					sortDirection: 'asc'
				}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);
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

			const getDispatcherStub = sandbox.stub(SlsApiBrowseData, 'getDispatcher');

			getDispatcherStub.returns(dispatcherStub);

			const apiResponse = await SlsApiBrowseData.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {
					'x-foo': 'bar'
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
				method: 'data',
				headers: {
					'x-foo': 'bar'
				},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);
		});

		it('Should return an error if the Dispatcher throws', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);

			dispatcherStub.dispatch.throws(new Error('Some error'));

			const getDispatcherStub = sandbox.stub(SlsApiBrowseData, 'getDispatcher');

			getDispatcherStub.returns(dispatcherStub);

			const apiResponse = await SlsApiBrowseData.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, {
				statusCode: 500,
				body: {
					message: 'Some error'
				}
			});

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'data',
				headers: {},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);
		});

		it('Should return an error with a custom statusCode if the Dispatcher throws with a code', async () => {

			const dispatcherStub = sandbox.stub(Dispatcher.prototype);

			const error = new Error('Some error');
			error.code = 503;

			dispatcherStub.dispatch.throws(error);

			const getDispatcherStub = sandbox.stub(SlsApiBrowseData, 'getDispatcher');

			getDispatcherStub.returns(dispatcherStub);

			const apiResponse = await SlsApiBrowseData.handler({
				path: {
					entity: 'some-entity'
				},
				headers: {},
				data: {}
			});

			assert.deepStrictEqual(apiResponse, {
				statusCode: 503,
				body: {
					message: 'Some error'
				}
			});

			sandbox.assert.calledOnce(getDispatcherStub);
			sandbox.assert.calledWithExactly(getDispatcherStub, {
				entity: 'some-entity',
				action: 'browse',
				method: 'data',
				headers: {},
				data: {}
			});

			sandbox.assert.calledOnce(dispatcherStub.dispatch);
		});
	});

});
