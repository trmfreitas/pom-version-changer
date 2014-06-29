
#pom-version-changer

Maven pom.xml version changer, dependencies´s manager, properties changer.

How to install
--------------

#### Node Application
- Clone the repository
- cd into *app* folder
- change the file config.json to suit your projects.
- do "npm install" to install dependencies
- execute with "node pom-version-changer.js"

#### Node.js dependency

- check folder *app* for a sample
- add as a dependecy to your project *pom-version-changer*
- add a require on your script
```
  var pvc = require("pom-version-changer");
```
- Execute changes with
```
  pvc.processFromFile(configFile, (argv.backup == true));

  or

  pvc.processFromFile(date, backupOption);
    Data should be an object with the same structure as the JSON file
```

Why should you use it?
----------------------

If you have a lot projects that have dependencies between them and you would like to ease version management process this script should help you with it.

Imagine that you have a big project with lots of subprojects and that those projects depend in some others also controlled by you.

```
  Project A
    : version 1.2
    - SubProject A.1
      : version 1.2 from parent
    - SubProject A.2
      : version 1.2 from parent
    - SubProject A.3
      : version 1.2 from parent
      - SubProject A.3.1
        : version 1.2 from parent

  Project B
    : version 3.0.1
    : depends on A.2
    - SubProject B.1
      : version 3.0.1 from parent
    - SubProject B.2
      : version 3.0.1 from parent
      : depends on A.2

  Project C
    : version 2.0
    : depends on A.2
    : depends on B.1
    : depends on B.2

```
To control versions for these projects you would have to change each pom.xml that has a version to point to the *new* updated version. (you could use *maven update child version* for project version and use *dependecies management*, but that is not easy enough).

With pom-version-changer full control over your pom.xml versions is possible. With only one file (*config.json*) projects are defined, versions are set, dependencies´s versions are configured.

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

###Run pom-version-changer

```
  node pom-version-changer.js --config=config.json --backup
```

Options __config__ and __backup__ are optional. If backup is specified a pom.xml.bak will be created.

