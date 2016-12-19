
    'use strict';

    module.exports = function(grunt) {

        grunt.initConfig({

            clean: ['public/js/', 'public/index.html', 'public/styles.css'],

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
                    src: [],
                    dest: ''
                },
            },

            watch: {
                html: {
                    files: ['app/assets/templates/index.html'],
                    tasks: ['copy:html']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask('test', ['jshint'] );
        grunt.registerTask('default', [ 'test', 'clean', 'copy' ] );
    };
