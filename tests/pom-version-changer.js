var should = require('chai').should(),
    pvc = require('../pom-version-changer.js'),
    jsxml = require('node-jsxml');

describe('#processFromFile', function() {
  it('checks that processing json from file is working OK', function() {
    pvc.processFromFile("config1.json", false);
  });
});

