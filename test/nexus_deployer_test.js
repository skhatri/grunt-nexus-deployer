'use strict';


var should = require('should'), mockexec = require('../tasks/lib/mockexec');

describe('Nexus Deployer', function () {

    var releaseHistory, snapshotHistory;
    var INNER_METADATA_FILE_PATTERN = /inner\.xml/;

    beforeEach(function () {
        var exec = mockexec();
        snapshotHistory = mockexec().data('snapshots');
        releaseHistory = exec.data('releases');
    });

    describe('After deployment', function () {

        it('9 artifacts are uploaded for release', function () {
            releaseHistory.length.should.equal(9);
        });

        it('12 artifacts are uploaded for snapshot', function () {
            snapshotHistory.length.should.equal(12);
        });

        it('all uploads are silent', function () {
            releaseHistory.concat(snapshotHistory).forEach(function (callParams) {
                if (callParams) {
                    callParams.should.match(/--silent/);
                }
            });
        });

        it('http code is sent to stdout', function () {
            releaseHistory.concat(snapshotHistory).forEach(function (callParams) {
                if (callParams) {
                    callParams.should.match(/--write-out %\{http_code\}/);
                }
            });
        });

        it('release uploads must not contain metadata files', function () {
            releaseHistory.filter(function (cmd) {
                return INNER_METADATA_FILE_PATTERN.test(cmd);
            }).length.should.equal(0);
        });

        it('snapshot uploads must contain 3 extra metadata files', function () {
            snapshotHistory.filter(function (uploadCmd) {
                return INNER_METADATA_FILE_PATTERN.test(uploadCmd);
            }).length.should.equal(3);
        });


    });


});
