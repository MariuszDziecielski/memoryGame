module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'expanded'
            },
            dist: {
                files: {
                    'css/style.css': 'sass/style.sass'
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/'
                }]
            }
        },
        jshint: {
            all: ['js/*.js'],
            options: {
                'esversion': 6
            }
        },
        watch: {
            sass: {
                files: ['sass/*.sass'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            jshint: {
                files: ['js/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'css/*.css',
                        'js/*.js',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: true,
                    browser: ['chrome']
                }
            }
        }
    });
    // Load the plugins tasks
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    // Default task(s)
    grunt.registerTask('default', ['imagemin', 'sass', 'jshint', 'browserSync', 'watch']);
};