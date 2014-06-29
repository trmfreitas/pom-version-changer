require('blanket')({
    pattern: function (filename) {
        return !/node_modules/.test(filename);
    }
  });

var should = require('chai').should(),
    pvc = require('../module.js'),
    jsxml = require('node-jsxml');

var fs = require('fs');



//create original files
fs.writeFileSync("path1/pom.xml", fs.readFileSync("path1/pom1.xml"));
fs.writeFileSync("path2/pom.xml", fs.readFileSync("path2/pom2.xml"));

describe('#processFromFile', function() {
  it('checks that processing json from file is working OK', function() {
    pvc.processFromFile("config1.json", true);
    var pom1original = fs.readFileSync("path1/pom1.xml");
    var pom2original = fs.readFileSync("path2/pom2.xml");
    var pom1 = fs.readFileSync("path1/pom.xml");
    var pom2 = fs.readFileSync("path2/pom.xml");
    var pom1result = fs.readFileSync("path1/pom.xml.result");
    var pom2result = fs.readFileSync("path2/pom.xml.result");
    var pom1bak = fs.readFileSync("path1/pom.xml.bak");
    var pom2bak = fs.readFileSync("path2/pom.xml.bak");
    pom1.toString().should.equal(pom1result.toString());
    pom2.toString().should.equal(pom2result.toString());
    pom1original.toString().should.equal(pom1bak.toString());
    pom2original.toString().should.equal(pom2bak.toString());
  });
});

