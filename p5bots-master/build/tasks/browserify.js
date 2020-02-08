'use strict';

var path = require('path');
var browserify = require('browserify');
var derequire = require('derequire');

var bannerTemplate = '/*! p5bots.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';

module.exports = function(grunt) {

  var srcFilePath = require.resolve('../../src/client/app.js');

  // This file will not exist until it has been built
  var libFilePath = path.resolve('lib/p5bots.js');

  grunt.registerTask('browserify', 'Compile the p5bots.js source with Browserify', function() {
    // Reading and writing files is asynchronous
    var done = this.async();

    // Render the banner for the top of the file
    var banner = grunt.template.process(bannerTemplate);

    // Invoke Browserify programatically to bundle the code
    var bundle = browserify(srcFilePath, {
        standalone: 'p5js'
      })
      .transform('brfs')
      .bundle();

    // Start the generated output with the banner comment,
    var code = banner + '\n';

    // Then read the bundle into memory so we can run it through derequire
    bundle.on('data', function(data) {
      code += data;
    }).on('end', function() {

      // "code" is complete: create the distributable UMD build by running
      // the bundle through derequire, then write the bundle to disk.
      // (Derequire changes the bundle's internal "require" function to
      // something that will not interfere with this module being used
      // within a separate browserify bundle.)
      grunt.file.write(libFilePath, derequire(code));

      // Print a success message
      grunt.log.writeln('>>'.green + ' Bundle ' + 'lib/p5bots.js'.cyan + ' created.');

      // Complete the task
      done();
    });
  });
};
