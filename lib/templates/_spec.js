require('../');
require('angular-mocks');
var _ = require('lodash');

beforeEach(angular.mock.module(require('../package.json')));

describe('<%= _.slugify(name) %>', function() {
	it('is awesome', function() {
		expect(true).to.equal(true);
	});
});