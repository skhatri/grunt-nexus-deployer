'use strict';


var should = require('should'), mockexec = require('../tasks/lib/mockexec'), fs = require('fs');

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
                    callParams.should.match(/--write-out \"%\{http_code\}\"/);
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

        it('ssl certificate errors can be skipped', function () {
            snapshotHistory.forEach(function (callParams) {
                if (callParams) {
                    callParams.should.match(/--insecure/);
                }
            });
        });

        it('ssl certificate errors are not skipped by default', function () {
            releaseHistory.forEach(function (callParams) {
                if (callParams) {
                    callParams.should.not.match(/--insecure/);
                }
            });
        });
		
		it('inner.xml should be generated correctly', function() {
			var expected = fs.readFileSync('test/expected/inner.xml', 'utf8');
			var actual = fs.readFileSync('test/pom/inner.xml', 'utf8');
			actual.should.equal(expected);
		});
		
		it('outer.xml should be generated correctly', function() {
			var expected = fs.readFileSync('test/expected/outer.xml', 'utf8');
			var actual = fs.readFileSync('test/pom/outer.xml', 'utf8');
			actual.should.equal(expected);
		});
		
		it('pom.xml should be generated correctly', function() {
			var expected = fs.readFileSync('test/expected/pom.xml', 'utf8');
			var actual = fs.readFileSync('test/pom/pom.xml', 'utf8');
			actual.should.equal(expected);
		});

    });


});
