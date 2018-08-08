#!/usr/bin/env node

var program = require('commander');
var copydir = require('copy-dir');
var jsonfile = require('jsonfile')
const exec = require("child_process").exec;
program
    .command("init <applicationName>")
    .description("initialize a new application")
    .action((applicationName) => {
        console.log("Initializing `" + applicationName + "` app...");
        copydir.sync(__dirname + "/framework", './' + applicationName);
        var packageFilePath = './' + applicationName + '/package.json'
        var packageFile = jsonfile.readFileSync(packageFilePath);
        packageFile.name = applicationName;
        jsonfile.writeFileSync(packageFilePath, packageFile, { spaces: 4 });
        exec("cd " + applicationName + " && npm install", (error, stdout, stderr) => {
            console.log("Creating the app successfully. Let's save the world! ");
            console.log("To start the app: `cd " + applicationName + " && node app.js`");
        })
    });
program.parse(process.argv);