# Introduction
`Quicksort.io` is a `node.js` framework for `http` and `socket.io` server application. It's simple, lightweight and familiar!

`Quicksort.io framework` supports both experienced programmers and newbies to develop `node.js` application in a structured way and easy to maintain.

It's used to build real-time applications, user activity tracking systems, chat applications and it's good for any web application project.


# Hello world example

## 1. Creating a Controller
To get started, let's create a Controller to handler requests by creating new `home-controller.js` file in `/controllers` directory

    module.exports = HomeController;
    function HomeController() {
        this.helloworld = function (io) {
            io.echo("hello world");
        };
    }

## 2. Routing
Routing http requests to the above controller. Open `/start/routes.js` file and add the following route:

    route.get("/", "HomeController@helloworld");

## 3. Launching it
Start the server:

    node app.js 

and send a http request, then it should print out: "hello world"

    curl http://localhost:2307/

# Installation
`Quicksort.io` framework is easy to install:

1. Cloning the project: `$ git clone https://github.com/megaads-vn/quicksort.io`

2. Changing current directory to project directory: `$ cd quicksort.io`

3. Installing dependencies: `$ npm install`

4. Finally, let's start: `$ node app.js`

# Directory structure

## `/assets`

The directory contains resource files.

## `/config`

As the name imples, cantains all application configurations such as: application port, debug mode, session configuration, autoload class map, service providers, etc.

## `/controllers`

The default directory contains application controllers.

By default, all controllers in this directory will be loaded automatically at booting time that configured as autoload directory in `config.app` file.

## `/core`

The directory contains core modules of the framework. 

Exploring it and you can learn about the framework's activity mechanism.

## `/libs`

Third-party libraries should be stored in this drectory.

## `/services`

An autoloaded directory that used  as default directory for service classes.

## `/start`

The directory loaded automatically at booting time

You will want to set start parameters in this. Including routes, event listeners or anything that configured as autoloaded directory , etc.

## `/storage`

The directory contains session files, logs, compiled files by the framework and by included libraries. 

This directory may be used to store any files utilized by your application.

## `/tests`

Unit test classes should be stored in this directory.

# Configuration
# Autoload class map
# Routing
# Filters
# Controllers
# Inputs and Responses
# Session
#IoC
#Services
# Events
# Logger