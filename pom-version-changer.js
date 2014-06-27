var jsxml = require("node-jsxml");
var fs = require('fs');

jsxml.XML.setSettings({ignoreComments : false, ignoreProcessingInstructions : false, createMainDocument: true});

function setVersion(file, version) {
    var data = fs.readFileSync(file, 'utf8');

    var xmlDoc= new jsxml.XML(data);
    if (xmlDoc.child('project').child('version') != "") {
      xmlDoc.child('project').child('version').setValue(version);
    }
    fs.writeFileSync(file, xmlDoc.toXMLString());
}

function setParentVersion(file, version) {
    var data = fs.readFileSync(file, 'utf8');
    var xmlDoc= new jsxml.XML(data);
    xmlDoc.child('project').child('parent').child('version').setValue(version);
    fs.writeFileSync(file, xmlDoc.toXMLString());
}

var VersionChanger = function(data) {
   this.data = data;
}

VersionChanger.prototype.getProject = function(name) {
   return this.data.projects[name];
}

VersionChanger.prototype.getProjectVersion = function(name) {
   return this.data.projects[name];
}

VersionChanger.prototype.updateVersions = function() {
  var projects = this.data.projects;
      var projectsversion = this.data["projects-version"];
      var dependenciesversion = this.data["dependencies-version"];
      var variablesvalue = this.data["variables-value"];

      for (var projectname in projectsversion)
         var project = this.getProject(projectname);
         var version = projectsversion[projectname].version;
         console.log("Setting " + projectname + " to version " + version);
         // set pom version of the project
         setVersion(project.pom, version);
         // now update child projects
         for(var proj in projects) {
           if (projects[proj].parent == projectname) {
              console.log("Setting child project " + proj + " parent version to " + version);
              setParentVersion(projects[proj].pom, version);
           }
         }
  }


fs.readFile('config.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  data = JSON.parse(data);
  //console.dir(data);

  if (typeof data.projects == "undefined")  {
      console.log("No projects are defined in config.json");
  } else {
      var vc = new VersionChanger(data);
      vc.updateVersions();
  }

});
