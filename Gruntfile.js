module.exports = function(grunt) {

  // Grunt configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    notify_hooks:{
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: "St.Anne's"
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 6 versions', 'Firefox ESR', 'Firefox >= 20', 'Opera 12.1']
      },
      single_file: {
        src: 'assets/css/global.css',
        dest: 'assets/css/global.css'
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      scripts: {
        src: [
          'assets/js/vendor/*.js',
          'assets/js/tm/tm.framework.js',
          'assets/js/tm/tm.framework.filter.js',
          'assets/js/tm/tm.framework.select.js',
          'assets/js/tm/tm.framework.search.js'
        ],
        dest: 'assets/js/site.js'
      }
    },


    // open the project's URL in the browser when grunt see is run
    // open: {
    //   all: {
    //     path: 'http://stanneaz.org.216-70-70-10.tipmedev.com/'
    //     //path: 'http://<%= express.all.options.ip %>:<%= express.all.options.port %>'
    //   }
    // },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'assets/css/global.css': 'assets/scss/global.scss'
        }
      }
    },

    uglify: {
      scripts: {
        files: {
          'assets/js/site.min.js': 'assets/js/site.js'
        }
      }
    },

    watch: {
      css: {
        files: [
          '**/*.sass',
          '**/*.scss'
        ],
        tasks: ['sass', 'autoprefixer'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: ['assets/js/vendor/*.js', 'assets/js/tm/*.js'],
        tasks: ['concat:scripts', 'uglify:scripts'],
        options: {
          spawn: false
        }
      }
    }
  })

  //grunt.loadNpmTasks('assemble')
  grunt.loadNpmTasks('grunt-autoprefixer')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
//  grunt.loadNpmTasks('grunt-express')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-notify')
  //grunt.loadNpmTasks('grunt-open')

  // register tasks
  grunt.registerTask('default', ['watch', 'notify_hooks'])

}
