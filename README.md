pom-version-changer
===================

maven pom.xml version changer

Configuration file config.json for some projects:

{
  "projects": {
    "iee-toolkit": {
      "pom": "C:/wc/iee/7.6/iee-toolkit/pom.xml"
    },
    "iee": {
      "pom": "C:/wc/iee/7.6/iee-toolkit/iee/pom.xml",
      "parent": "iee-toolkit"
    },
    "iee-report": {
      "pom": "C:/wc/iee/7.6/iee-toolkit/report/pom.xml",
      "parent": "iee-toolkit"
    },
    "iee-tutorial": {
      "pom": "C:/wc/iee/7.6/iee-toolkit/tutorial/pom.xml",
      "parent": "iee-toolkit"
    },
    "efa-components": {
      "pom": "C:/wc/p2/15.6/efa-components/java/pom.xml"
    },
    "efa-dependencies": {
      "pom": "C:/wc/p2/15.6/efa-components/java/efa-dependencies/pom.xml",
      "parent": "efa-components"
    },
    "efa-pom": {
      "pom": "C:/wc/p2/15.6/efa-pom/pom.xml"
    }
  },

  "projects-version": {
    "iee-toolkit": "7.6.4",
    "efa-components": "15.6.4"
  },

  "dependencies-version": {
    "pt.efacec.se.aut/bus-core": "8.1.1",
    "pt.efacec.se.aut/bus-extensions": "2.1.1"
  },

  "properties": {
    "currentVersion": "15.6.4",
    "efaDependenciesVersion": "15.6.4",
    "scadaEditorVersion": "3.1.3",
    "ieeVersion": "7.6.4",
    "ieeReport": "7.6.4"
  }
}


projects: define projects and parents
projects-version: configure version for each product that you want to manage
dependencies-version: configure dependencies version which will be updated on each project that has them defined
variables-value: configure variables value to be set on each project

There is no need to configure variables and dependencies because they can be automatically found by parsing pom file.

pom-verion-changer depends on node-jsxml version with createMainDocument change. There is a pull request for the change on main repo. You can grab the copy of jsxml.js from my repo.
