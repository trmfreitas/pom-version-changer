var jsxml = require("node-jsxml");
jsxml.XML.setSettings({ignoreComments : false, ignoreProcessingInstructions : false, createMainDocument: true});

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

function PVC() {};

PVC.help = function (){
  console.log("");
  console.log("pom-version-changer - manage maven pom versions");
  console.log("  node pom-version-changer [--help] [--backup] [--config=file]");
  console.log("");
  console.log(" All optional arguments.");
  console.log(" Specify --backup to create a backup file on the same directory as pom.xml.");
  console.log(" Specify --config to define which config.json file to process.");
  console.log("");
}

PVC.process = function(configFile, doBackups) {

  fs.readFile(configFile, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    data = JSON.parse(data);

    if (typeof data.projects == "undefined")  {
      console.log("No projects are defined in config.json");
    } else {
      var vc = new VersionChanger(data, doBackups);
      if (doBackups) {
        vc.backupFiles();
      }
      vc.updateVersions();
      vc.updateProperties();
      vc.updateDependencies();
    }
  });

}

PVC.backup = function(file) {
  fs.writeFileSync(file+".bak", fs.readFileSync(file));
}

PVC.setVersion = function(file, version) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var node = xmlDoc.child('project').child('version');
  if (node != "" && node.getValue()!=version) {
    node.setValue(version);
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }

}

PVC.setParentVersion = function (file, version) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var node = xmlDoc.child('project').child('parent').child('version');
  if (node != "" && node.getValue()!=version) {
    node.setValue(version);
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }
}

PVC.setProperties = function(file, properties) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var changed = false;
  if (typeof xmlDoc.child('project').child('properties') != "undefined") {
    for(var property in properties) {
      var node = xmlDoc.child('project').child('properties').child(property);
      if (node != "") {
        var value = properties[property];
        var prevvalue = node.getValue();
        if (value!=prevvalue) {
          console.log("Updating properties of " + file  + ": " + property + "=" + value);
          node.setValue(value);
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }
}

PVC.getDependencyVersion = function(dependencies, groupdId, artifactId) {
  return dependencies[groupdId+"/"+artifactId];
}


PVC.setDependencies = function (file, dependencies) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var changed = false;
  if (typeof xmlDoc.child('project').child('dependencyManagement') != "undefined") {
    var node = xmlDoc.child('project').child('dependencyManagement').child("dependencies");
    if (node != "") {
      //get all children
      var children = node.child("*");
      children.each(function(dependency, index) {
        var groupId = dependency.child("groupId");
        var artifactId = dependency.child("artifactId");
        var version = dependency.child("version");
        if (version == "") {
          //no version
          return;
        } else if (version.getValue().trim().substring(0,1)!="$"){ //also check if there was a variable there to not replace it
          var depVersion = PVC.getDependencyVersion(dependencies,groupId,artifactId);
          if (typeof depVersion != "undefined") {
            console.log(file + " setting dependency mng. version of " + groupId + "/"+artifactId + " to " + depVersion);
            dependency.child("version").setValue(depVersion);
            changed = true;
          }
        }
      });
    }
  }

  var node = xmlDoc.child('project').child('dependencies');

  if (node != "") {
    //get all children
    var children = node.child("*");
    children.each(function(dependency, index) {
      var groupId = dependency.child("groupId");
      var artifactId = dependency.child("artifactId");
      var version = dependency.child("version");
      if (version == "") {
        //no version
        return;
      } else if (version.getValue().trim().substring(0,1)!="$"){ //also check if there was a variable there to not replace it
        var depVersion = PVC.getDependencyVersion(dependencies,groupId,artifactId);
        if (typeof depVersion != "undefined") {
          console.log(file + " setting dependency version of " + groupId + "/"+artifactId + " to " + depVersion);
          dependency.child("version").setValue(depVersion);
          changed = true;
        }
      }
    });
  }

  if (changed) {
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }
}

//////////////////////////////////////////////////////////////

var VersionChanger = function(data, doBackups) {
  this.data = data;
  this.doBackups = doBackups;
}

VersionChanger.prototype.getProject = function(name) {
  return this.data.projects[name];
}

VersionChanger.prototype.getProjectVersion = function(name) {
  return this.data.projects[name];
}

VersionChanger.prototype.getPath = function(basepath, relative) {
  if (typeof basepath != "undefined" && basepath!="") {
    return this.data.paths[basepath]+"/"+relative;
  } else {
    return relative;
  }
}

VersionChanger.prototype.backupFiles = function() {
  var projects = this.data.projects;

  for (var projectname in projects) {
    var project = this.getProject(projectname);
    PVC.backup(this.getPath(project.basepath, project.pom));
  }

}

VersionChanger.prototype.updateVersions = function() {
  var projects = this.data.projects;
  var projectsversion = this.data["projects-version"];

  for (var projectname in projectsversion) {
    var project = this.getProject(projectname);
    var version = projectsversion[projectname];
    console.log("Setting " + projectname + " to version " + version);
    // set pom version of the project
    PVC.setVersion(this.getPath(project.basepath,project.pom), version);
    // now update child projects
    for(var proj in projects) {
      if (projects[proj].parent == projectname) {
        console.log("Setting child project " + proj + " parent version to " + version);
        PVC.setParentVersion(this.getPath(projects[proj].basepath,projects[proj].pom), version);
      }
    }
  }}

VersionChanger.prototype.updateProperties = function() {
  var projects = this.data.projects;
  var properties = this.data["properties"];

  for (var projectname in projects) {
    PVC.setProperties(this.getPath(projects[projectname].basepath,projects[projectname].pom), properties);
  }
}

VersionChanger.prototype.updateDependencies = function() {
  var projects = this.data.projects;
  var dependenciesversion = this.data["dependencies-version"];

  for (var projectname in projects) {
    PVC.setDependencies(this.getPath(projects[projectname].basepath,projects[projectname].pom), dependenciesversion);
  }
}


if (argv.help == true) {
  PVC.help();
  return;
} else {
  var configFile = typeof argv.config != "undefined" ? argv.config : "config.json";
  PVC.process(configFile, (argv.backup == true));
}
