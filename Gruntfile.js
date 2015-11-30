module.exports = function(grunt) {

  var cssFiles = [
  'client/bower_components/materialize/bin/materialize.css',
  'client/css/main.css',
  'client/app/artists/artists.css',
  'client/app/artist/artist.css'
  ];

  var staticJSFiles = [
  'client/bower_components/jquery/dist/jquery.js',
  'client/bower_components/angular/angular.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  'client/bower_components/materialize/bin/materialize.js'
  ];

  var nonStaticJSFiles = [
  'client/jamController.js',
  'client/app/services/services.js',
  'client/app.js',
  ];
  var cssJS = cssFiles.concat(nonStaticJSFiles);

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



