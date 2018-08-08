# Introduction
`Sam.io` is a `node.js` framework for `http` and `socket.io` server application. It's simple, lightweight and familiar!

`Sam.io framework` supports both experienced programmers and newbies to develop `node.js` application in a structured way and easy to maintain.

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
Routing requests to the above controller. Open `/start/routes.js` file and add the following route:

    route.get("/", "HomeController@helloworld");

or without a controller:

    route.get("/", function(io) {
        io.echo("hello world");
    });

## 3. Launching it
Start the app:

    node app.js 

and send a http request, then it should print out: "hello world"

    curl http://localhost:2307/

# Installation
`sam.io` framework is easy to install:

1. Get the latest stable release of Sam.io : `$ npm install sam.io -g`

2. Create a new application: `$ sam ini app-name`
   
3. Change current directory to the app directory: `$ cd app-name`

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
# IoC
# Services
# Events
# Logger

# License

The Apify is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
# Contact us/ Instant feedback

Email: phult.contact@gmail.com

Skype: [phult.bk](skype:phult.bk?chat)