#! /usr/bin/env node

const co = require('co');
const r = require('rethinkdb');
const inquirer = require('inquirer');
const ora = require('ora');
const json2csv = require('json2csv');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const mkdirp = require('mkdirp');
require('dotenv').config();

const connectionInfo = {
    host: process.env.RETHINK_HOST,
    port: process.env.RETHINK_PORT,
    user: process.env.RETHINK_USER,
    password: process.env.RETHINK_PASS,
    db: process.env.RETHINK_DB_NAME
};

const getConnection = () => {
    return new Promise((resolve, reject) => {
        r.connect(connectionInfo).then(conn => {
            resolve(conn);
        }).catch(err => {
            reject(err);
        });
    });
};

const getTables = (conn) => {
    return new Promise((resolve, reject) => {
        co(function* () {
            const tableList = yield r.tableList().run(conn);
            resolve(tableList);
        }).catch(reject);
    });
};

const getFields = data => {
    // Create an array of all fields found in the data
    const fields = data.reduce((acc, row) => acc.concat(Object.keys(row)), []);
    // Remove duplicate items, and filter out certain fields
    return [...new Set(fields)].filter(field => field !== 'password' && field !== '$hz_v$');
};

const jsonToCSV = (table, data) => {
    return new Promise((resolve, reject) => {
        const fields = getFields(data);
        const csv = json2csv({ data, fields });
        const date = moment().utc().format('YYYY-MM-DD_HH-mm-ss');
        const filename = `${connectionInfo.db}_${table}_${date}.csv`;
        const filePath = path.join(process.cwd(), 'exports');
        const fullPath = path.join(filePath, filename);
        mkdirp.sync(filePath);
        fs.writeFile(fullPath, csv, err => {
            if (err) reject(err);
            resolve(`${fullPath}`);
        });
    });
};

const getTableData = (conn, table) => {
    return new Promise((resolve, reject) => {
        co(function* () {
            const cursor = yield r.table(table).run(conn);
            const data = yield cursor.toArray();
            resolve(data);
        }).catch(reject);
    });
};

const promptConfirm = () => {
    return [{
        type: 'confirm',
        name: 'confirmConnection',
        message: `Is this the correct database connection: ${connectionInfo.host}:${connectionInfo.port}/${connectionInfo.db}?`
    }];
};

const promptTable = (tableList) => {
    return [{
        type: 'list',
        name: 'table',
        message: 'What table would you like to export?',
        choices: tableList,
        default: 'users'
    }];
};

function begin() {
    co(function* () {
        const { confirmConnection } = yield inquirer.prompt(promptConfirm());

        if (!confirmConnection) {
            console.log(chalk.red.bold('Please adjust your connection settings and rerun this command!'));
            process.exit(0);
        }

        let spinner = new ora('Connecting to Database.').start();
        const conn = yield getConnection();
        spinner.succeed();

        spinner = new ora('Fetching List of Tables').start();
        const tableList = yield getTables(conn);
        spinner.succeed();

        const { table } = yield inquirer.prompt(promptTable(tableList));

        spinner = new ora('Fetching Table Data.').start();
        const data = yield getTableData(conn, table);
        spinner.succeed();

        spinner = new ora('Converting to CSV').start();
        const result = yield jsonToCSV(table, data);
        spinner.succeed();

        console.log(chalk.green('Success!') + ' File was saved at ' + chalk.blue.underline.bold(result));
        process.exit(0);
    }).catch((err) => {
        console.log(chalk.red.bold(err));
        process.exit(1);
    });
}

begin();

module.exports.getFields = getFields;
