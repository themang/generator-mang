'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var _ = require('underscore');
var git = require('gift');
var fs = require('fs');

require('colors');


var MangGenerator = module.exports = function MangGenerator(args, options, config) {
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(MangGenerator, yeoman.generators.NamedBase);

MangGenerator.prototype.prompts = function prompts() {
  var cb = this.async();
  var prompts = [{
    name: 'repo',
    message: 'What is your git url (git@github.com/...)?'
  }];
  this.prompt(prompts, function (props) {
    this.repo = props.repo;
    cb();
  }.bind(this));
}

MangGenerator.prototype.gitInit = function gitInit() {
  var cb = this.async();
  var name = this.name;
  var repoUrl = this.repo;

  console.log('cloning pup (this will take a sec)...'.green);
  git.clone('https://github.com/themang/pup', name, function(err, repo) {
    if (err) throw err;
    repo.create_branch('seed', function(err) {
      if (err) throw err;
      repo.remote_remove('origin', function(err) {
        if (err) throw err;
        repo.remote_add('origin', repoUrl, function(err) {
          if (err) throw err;
          console.log('pushing seed branch for easy mang updates (this will take a sec)...'.green);
          repo.remote_push('origin seed', function(err) {
            if (err) throw err;
            cb();
          });
        });
      })
    });
  });
};

MangGenerator.prototype.renameConfigs = function renameConfigs() {
  var self = this;
  console.log('changing name of package configs...'.green);
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


