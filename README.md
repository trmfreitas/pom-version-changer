
pom-version-changer
===================

maven pom.xml version changer

How to install
--------------

- Clone the repository and change the file config.json to suit your projects.
- do "npm install" to install dependencies
- execute with "node pom-version-changer.js"

How to use
----------

Configuration file config.json for some projects:
```
{
  "paths": {
    "iee": "C:/wc/iee/7.6/iee-toolkit",
    "efa-components": "C:/wc/p2/15.6/efa-components/java",
    "efa-pom": "C:/wc/p2/15.6/efa-pom/"
  },
  "projects": {
    "iee-toolkit": {
      "pom": "pom.xml",
      "basepath": "iee"
    },
    "iee": {
      "pom": "iee/pom.xml",
      "parent": "iee-toolkit",
      "basepath": "iee"
    },
    "iee-report": {
      "pom": "report/pom.xml",
      "parent": "iee-toolkit",
      "basepath": "iee"
    },
    "iee-tutorial": {
      "pom": "tutorial/pom.xml",
      "parent": "iee-toolkit",
      "basepath": "iee"
    },
    "efa-components": {
      "pom": "pom.xml",
      "basepath": "efa-components"
    },
    "efa-dependencies": {
      "pom": "efa-dependencies/pom.xml",
      "parent": "efa-components",
      "basepath": "efa-components"
    },
    "efa-pom": {
      "pom": "pom.xml",
      "basepath": "efa-pom"
    }
  },

  "projects-version": {
    "iee-toolkit": "7.6.4",
    "efa-components": "15.6.4"
  },

  "dependencies-version": {
    "pt.efacec.se.aut/bus-core": "8.1.1",
    "pt.efacec.se.aut/bus-extensions": "2.1.1",
    "pt.efacec.se.aut/iee": "7.6.4"
  },

  "properties": {
    "currentVersion": "15.6.4",
    "efaDependenciesVersion": "15.6.4",
    "ieeVersion": "7.6.4",
    "ieeReport": "7.6.4"
  }
}
```
**paths**: paths that you reference on projects by using *basepath*
**projects**: define projects and parents
**projects-version**: configure version for each product that you want to manage
**dependencies-version**: configure dependencies version which will be updated on each project that has them defined
**properties**: configure variables value to be set on each project

There is no need to configure variables and dependencies because they can be automatically found by parsing pom file.

**pom-verion-changer depends on node-jsxml version with createMainDocument change. There is a pull request for the change on main repo. You can grab the copy of jsxml.js from my repo.**
