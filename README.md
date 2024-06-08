# Go Map!! Quest Templates

## Table of contents

- [Repository Structure](#repository-structure)
- [Usage](#usage)
- [Commands](#commands)
- [Contribution](#contribution)

This repository is used to collect templates for quests that can be added to [GoMap!!][1]

## Repository Structure

The structure of the project will be according to the [map][2] feature of OSM.

## Usage

<!-- usage -->

```sh-session
$ npm install -g gomapquesttemplates
$ gomapquests COMMAND
running command...
$ gomapquests (--version)
gomapquesttemplates/1.0.0 darwin-arm64 node-v20.14.0
$ gomapquests --help [COMMAND]
USAGE
  $ gomapquests COMMAND
...
```

<!-- usagestop -->

## Commands

<!-- commands -->

- [`gomapquests create`](#gomapquests-create)

## `gomapquests create`

Generates a JSON file with quests. This file can be imported by Go Map!!

```
USAGE
  $ gomapquests create [-q <value>...] [-d <value>] [-o <value>]

FLAGS
  -d, --directory=<value>  the directory you want to create the json output for
  -o, --output=<value>     [default: ./output] output directory
  -q, --quests=<value>...  name of the quest file you want to create a json output for

DESCRIPTION
  Generates a JSON file with quests. This file can be imported by Go Map!!

EXAMPLES
  $ gomapquests create -q service:bicycle:pump -q access -o ./output

  $ gomapquests create -d bicycle_parking -o ./output
```

<!-- commandsstop -->

## Contribution

TBD

[1]: https://github.com/bryceco/GoMap
[2]: https://wiki.openstreetmap.org/wiki/Map_features
