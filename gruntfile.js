
    'use strict';

    module.exports = function(grunt) {

        grunt.initConfig({

            clean: ['public/js/', 'public/index.html', 'public/styles.css', 'public/styles.css.map'],

            jshint: {
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [
                        'node_modules/**',
                        'vendor/**',
                        'tmp/**',
                        'test/**',
                        'log/**',
                        'lib/**',
                        'db/**',
                        'config/**',
                        'bin/**'
                    ]
                },
                source: {
                    files: {
                        src: [ 'app/assets/javascripts/**/*.js' ]
                    }
                }
            },

            copy: {
                html: {
                    files: [
                        {
                            expand: true,
                            cwd: 'app/assets/templates/',
                            src: 'index.html',
                            dest: 'public/'
                        }
                    ]
                }
            },

            concat: {
                js: {
                    src: [ 'app/assets/javascripts/**.*js'],
                    dest: 'public/js/app.js'
                },
                vendorjs: {
                    files: [
                        {
                            expand: true,
                            cwd: 'node_modules/jquery/dist/',
                            src: [ 'jquery.js' ],
                            dest: 'public/js'

                        },
                        {
                            expand: true,
                            cwd: 'node_modules/openlayers/dist',
                            src: [ 'ol.js' ],
                            dest: 'public/js'
                        },
                        {
                            expand: true,
                            cwd: 'node_modules/openlayers/dist',
                            src: 'ol.css',
                            dest: 'public/'
                        }
                    ]
                }
            },

            sass: {
                allStyles: {
                    files: {
                        'public/styles.css': 'app/assets/stylesheets/sass/main.scss'
                    }
                }
            },

            watch: {
                html: {
                    files: ['app/assets/templates/index.html'],
                    tasks: ['copy:html']
                },
                sass: {
                    files: ['app/assets/stylesheets/sass/**/*.scss'],
                    tasks: ['sass']
                },
                js: {
                    files: ['app/assets/javascripts/**/*.js'],
                    tasks: ['test', 'concat']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-sass');

        grunt.registerTask('test', ['jshint'] );
        grunt.registerTask('default', [ 'test', 'clean', 'copy', 'concat' ] );
    };
