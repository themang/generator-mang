var es = require('event-stream')
  , path = require('path')
  , findup = require('findup-sync')
  , origCwd = process.cwd();

module.exports = function(config) {
  config.set({
    autoWatch: true,
    frameworks: ['mocha', 'sinon-chai', 'browserify'],
    browsers: ['Chrome'],
    files: ['spec/*.js'],
    preprocessors: {
      '**/*.js': ['browserify']
    },
    reporters: ['progress'],
    browserify: {
      transform: [
        function(file) {
          // XXX so hacky
          process.chdir(path.dirname(findup('bower.json')));
          return es.mapSync(function(data) {
            return data;
          });
        },
        require('../../browserify/dereqify.js'),
        require('../../browserify/derrorify.js').transform,
        'dehtmlify',
        'decomponentify',
        'debowerify',
        function(file) {
          process.chdir(origCwd);
          return es.mapSync(function(data) {
            return data;
          });
        }
      ],
      postBundle: require('../../browserify/derrorify.js').postBundleCb,
      watch: true
    }
  });
};