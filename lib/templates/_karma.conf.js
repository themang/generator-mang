var es = require('event-stream')
  , path = require('path')
  , findup = require('findup-sync')
  , origCwd = process.cwd()
  , root = path.dirname(findup('bower.json'))
  , derrify = require('derrify')(path.join(root, 'lib/error/err.msg'));

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
        function() {
          // XXX so hacky
          process.chdir(root);
          return es.mapSync(function(data) {
            return data;
          });
        },
        require('dereqify'),
        derrify.transform,
        'dehtmlify',
        'decomponentify',
        'debowerify',
        function() {
          process.chdir(origCwd);
          return es.mapSync(function(data) {
            return data;
          });
        }
      ],
      postBundle: derrify.postBundleCb,
      watch: true
    }
  });
};