/*
 * grunt-sonar-runner
 * https://github.com/skhatri/grunt-sonar-runner
 *
 * Copyright (c) 2014 Suresh Khatri
 * Licensed under the MIT license.
 */

'use strict';

var format = require('util').format, deploy = require('./lib');

module.exports = function (grunt) {

    grunt.registerMultiTask('nexusDeployer', 'Deploy artifacts to nexus from grunt', function () {
        var options = this.options({
            debug: false,
            dryRun: false,
            cwd: ''
        });

        /*
         * If a username or password is passed on the command line, the configuration in the Gruntfile.js is overridden.
         *
         * Example: grunt nexusDeployer --username=user --password=password
         *
         * @author Geroen Joris 
         */
        var passedUsername = grunt.option('username');
        var passedPassword = grunt.option('password');
        if (passedUsername || passedPassword) {
            grunt.verbose.writeln("Found username and password on the command line. Overriding the configured authentication, if any.");
            options.auth = {
                username: passedUsername,
                password: passedPassword
            }
        }

        var done = this.async();
        deploy(options, done);
    });

};
