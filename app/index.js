'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var _ = require('underscore');
var fs = require('fs');


var MangGenerator = module.exports = function MangGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MangGenerator, yeoman.generators.Base);

MangGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log("Welcome to the mang!");

  var prompts = [{
    name: 'mangName',
    message: 'What do you want to call your mang?'
  }];

  console.log('Initializing the mang...');

  this.prompt(prompts, function (props) {
    this.name = props.mangName;

    cb();
  }.bind(this));

};

MangGenerator.prototype.gitInit = function gitInit() {
  var cb = this.async();
  var name = this.name;

  var ps = spawn('git', ['clone','https://github.com/weo-edu/frontend-boilerplate', name], {stdio: 'inherit'});
  ps.on('close', function(code) {
    if (code !== 0) {
      console.error('Failed to initialize - exited with ' + code);
    } else {
      process.chdir(name);
      var psBranch = spawn('git', ['branch', 'seed'], {stdio: 'inherit'});
      psBranch.on('close', function(code) {
        if (code !== 0) {
          console.error('Failed to branch - exited with ' + code);
        } else {
          cb();
        }
      })
    }
  });

};

MangGenerator.prototype.renameConfigs = function renameConfigs() {
  var self = this;
  _.each(['package.json', 'bower.json', 'component.json'], function(pkgType) {
    var body = self.read('_' + pkgType, 'utf8');
    body = self.engine(body, self);
    var templatePkg = JSON.parse(body);
    try {
      var pkg = require(path.join(process.cwd(), pkgType));
      pkg = _.extend(pkg, templatePkg);
    } catch(e) {
      var pkg = templatePkg;
    }
    fs.writeFileSync(pkgType, JSON.stringify(pkg, null, 2));
  });
}


