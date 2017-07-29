# rethink-to-csv
Node.js CLI module to Export RethinkDB Tables to CSV files

[![npm version][npm-badge]][npm-badge-url]
[![Build Status](https://travis-ci.org/grailian/rethink-to-csv.svg?branch=master)](https://travis-ci.org/grailian/rethink-to-csv)
[![Coverage Status](https://coveralls.io/repos/github/grailian/rethink-to-csv/badge.svg?branch=master)](https://coveralls.io/github/grailian/rethink-to-csv?branch=master)
[![Dependency Status](https://david-dm.org/grailian/rethink-to-csv/status.svg)](https://david-dm.org/grailian/rethink-to-csv)

## How to use

### Install Locally

```bash
$ npm install rethink-to-csv --save-dev
$ yarn add rethink-to-csv --dev 
```
And include as an **script** in your `package.json`:
```json

{
...
  "scripts": {
    "export": "rethink-to-csv"
  },
...
}
```
Which you can then run as `npm run export`

### Install Globally
To run from the Command Line

```bash
$ npm install -g rethink-to-csv --save
$ yarn global add rethink-to-csv
```

---

The following Environment Variables are required in order to run:

```bash
RETHINK_HOST={hostname} # i.e. localhost
RETHINK_PORT={port} # i.e. 28015
RETHINK_USER={user} i.e. admin
RETHINK_PASS={password{
RETHINK_DB_NAME={database name}
```

It will inject environment vairables from a `.env` file if one is found in the directory where the script is executed.
