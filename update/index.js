'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var Step = require('step');
var spawn = require('child_process').spawn;
var git = require('gift');
var _ = require('underscore');
var exec = require('child_process').exec;
require('colors');


var UpdateGenerator = module.exports = function UpdateGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.Base.apply(this, arguments);

};

util.inherits(UpdateGenerator, yeoman.generators.Base);

UpdateGenerator.prototype.gitUpdate = function gitUpdate() {
	var cb = this.async();

	var repo = git('./');

	function checkoutSeed(cb) {
		var checkedout = false;
		Step(function() {
			repo.branches(this);
		}, function(err, branches) {
			if (err) throw err;
			if (_.findWhere(branches, {name: 'seed'})) {
				repo.checkout('seed', this);
			} else {
				repo.checkout('-t origin/seed', this)
			}
		}, function(err) {
			cb(err);
		});
	}


	Step(function() {
		console.log('grabbing changes to pup...'.green)
		checkoutSeed(this);
	}, function(err) {
		if (err) throw err;
		exec('git pull https://github.com/themang/pup master', {maxBuffer: 10000 * 1024}, this);
	}, function(err) {
		if (err) throw err;
		console.log('merging changes...'.green);
		repo.checkout('master', this);
	}, function(err) {
		if (err) throw err;
		 var cp = require("child_process").spawn('git', ['merge', 'seed'], {
			stdio: 'inherit'
		});
		cp.on('close', cb)
	});
  
};
