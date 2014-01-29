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
        var done = this.async();
        deploy(options, done);
    });

};
