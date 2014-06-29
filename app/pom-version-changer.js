var pvc = require('pom-version-changer');
var argv = require('minimist')(process.argv.slice(2));

if (argv.help == true) {
  pvc.help();
} else {
  var configFile = typeof argv.config != "undefined" ? argv.config : "config.json";
  pvc.processFromFile(configFile, (argv.backup == true));
}
