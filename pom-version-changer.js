var jsxml = require("node-jsxml");
var fs = require('fs');

jsxml.XML.setSettings({ignoreComments : false, ignoreProcessingInstructions : false, createMainDocument: true});

function setVersion(file, version) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var node = xmlDoc.child('project').child('version');
  if (node != "" && node.getValue()!=version) {
    node.setValue(version);
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }

}

function setParentVersion(file, version) {
  var data = fs.readFileSync(file, 'utf8');
  var xmlDoc= new jsxml.XML(data);
  var node = xmlDoc.child('project').child('parent').child('version');
  if (node != "" && node.getValue()!=version) {
    node.setValue(version);
    fs.writeFileSync(file, xmlDoc.toXMLString());
  }
}

function setProperties(file, properties) {
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

function getDependencyVersion(dependencies, groupdId, artifactId) {
  return dependencies[groupdId+"/"+artifactId];
}

function setDependencies(file, dependencies) {
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
        } else {
          var depVersion = getDependencyVersion(dependencies,groupId,artifactId);
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
      } else {
        var depVersion = getDependencyVersion(dependencies,groupId,artifactId);
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

  for (var projectname in projectsversion)
    var project = this.getProject(projectname);
  var version = projectsversion[projectname];
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

VersionChanger.prototype.updateProperties = function() {
  var projects = this.data.projects;
  var properties = this.data["properties"];

  for (var projectname in projects) {
    setProperties(projects[projectname].pom, properties);
  }
}

VersionChanger.prototype.updateDependencies = function() {
  var projects = this.data.projects;
  var dependenciesversion = this.data["dependencies-version"];

  for (var projectname in projects) {
    setDependencies(projects[projectname].pom, dependenciesversion);
  }
}

fs.readFile('config.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  data = JSON.parse(data);

  if (typeof data.projects == "undefined")  {
    console.log("No projects are defined in config.json");
  } else {
    var vc = new VersionChanger(data);
    vc.updateVersions();
    vc.updateProperties();
    vc.updateDependencies();
  }

});
