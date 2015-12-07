module.exports = function(grunt) {

  var cssFiles = [
  'client/bower_components/materialize/bin/materialize.css',
  'client/app/main/main.css',
  'client/app/artists/artists.css',
  'client/app/artist/artist.css'
  ];

  var staticJSFiles = [
  'client/bower_components/jquery/dist/jquery.js',
  'client/bower_components/angular/angular.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  'client/bower_components/materialize/bin/materialize.js',
  'client/bower_components/moment/moment.js'
  ];

  var nonStaticJSFiles = [
  'client/app/main/jamController.js',
  'client/app/artist/artistCtrl.js',
  'client/app/artists/artistsCtrl.js',
  'client/app/main/services.js',
  'client/app/artist/artistService.js',
  'client/app/artists/artistsService.js',
  'client/app.js',
  'client/app/artists/artistsDirective.js',
  'client/app/artist/artistDirective.js'
  ];

  var cssJS = cssFiles.concat(nonStaticJSFiles);
  var jsFiles = staticJSFiles.concat(nonStaticJSFiles);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: false
      },
      bundle: {
        files: {
          'client/dist/bundle.min.js': 'client/dist/bundle.js'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      bundle: {
        src: jsFiles,
        dest: 'client/dist/bundle.js',
      },
      css : {
        src: cssFiles,
        dest: 'client/dist/bundle.css'
      }
    },
    watch: {
      files: cssJS,
      tasks: ['prod']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('prod', ['concat', 'uglify']);

};



