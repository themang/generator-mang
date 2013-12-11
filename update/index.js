'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var Step = require('step');
var spawn = require('child_process').spawn;

var UpdateGenerator = module.exports = function UpdateGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.Base.apply(this, arguments);

};

util.inherits(UpdateGenerator, yeoman.generators.Base);

UpdateGenerator.prototype.gitUpdate = function gitUpdate() {
	var cb = this.async();
	Step(function() {
		var step = this;
		var ps = spawn('git', ['commit','-am', "'updating seed"], {stdio: 'inherit'});
		ps.on('close', function(code) {
			if (code !== 0 && code !== 1) {
	      throw new Error('Failed to commit - exited with ' + code);
	    } else {
	    	step(null);
	    }
	  });
	}, function(err) {
		if (err) throw err;
		var step = this;
		var ps = spawn('git', ['checkout', 'seed'], {stdio: 'inherit'});
		ps.on('close', function(code) {
			if (code !== 0) {
	      throw new Error('Failed to checkout seed - exited with ' + code);
	    } else {
	    	step(null);
	    }
	  });
	}, function(err) {
		if (err) throw err;
		var step = this;
		var ps = spawn('git', ['pull', 'https://github.com/weo-edu/frontend-boilerplate', 'master'], {stdio: 'inherit'});
		ps.on('close', function(code) {
			if (code !== 0) {
	      throw new Error('Failed to pull seed - exited with ' + code);
	    } else {
	    	step(null);
	    }
	  });
	}, function(err) {
		if (err) throw err;
		var step = this;
		var ps = spawn('git', ['checkout', 'master'], {stdio: 'inherit'});
		ps.on('close', function(code) {
			if (code !== 0) {
	      throw new Error('Failed to checkout original - exited with ' + code);
	    } else {
	    	step(null);
	    }
	  });
	}, function(err) {
		if (err) throw err;
		var step = this;
		var ps = spawn('git', ['merge', 'seed'], {stdio: 'inherit'});
		ps.on('close', function(code) {
			if (code !== 0) {
	      throw new Error('Failed to checkout original - exited with ' + code);
	    } else {
	    	step(null);
	    }
	  });
	}, function (err) {
		if (err) throw err;
		cb();
	});
  
};
