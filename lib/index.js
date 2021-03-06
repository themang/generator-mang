'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');

var LibGenerator = module.exports = function LibGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the lib subgenerator with the argument ' + this.name + '.');


};

util.inherits(LibGenerator, yeoman.generators.NamedBase);

LibGenerator.prototype.ask = function ask() {
	var self = this;
	var cb = self.async();

	var prompts = [{
		type: 'confirm',
    name: 'serverSide',
    message: 'Does it have a server side entry point?',
    default: false
  }];


  self.prompt(prompts, function(props) {
  	self.serverSide = props.serverSide;
  	cb();
  })
};

LibGenerator.prototype.files = function files() {
  this.mkdir(path.join('lib', this.name));
  this.template('_package.json', path.join('lib', this.name, 'package.json'));
  this.template('_main.js', path.join('lib', this.name, this._.slugify(this.name) + '.js'));
  if (this.serverSide)
  	this.template('_index.js', path.join('lib', this.name, 'index.js'));
};
