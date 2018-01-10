module.exports = function(grunt) {

	var SRC_DIR = "src"; //Source directory
	var DIST_DIR = "dist"; //Distribution directory
	
	grunt.initConfig({
		webpack: {
			dist : {
				context : "./" + SRC_DIR + "/js",
				entry : "./nav.js",
				output : {
					path : DIST_DIR + "/js",
					filename : "main.js",
					library : "baseRaiders",
					libraryTarget : "umd"
				},
				module : {
					loaders : [{
						test : /\.html$/,
						loader : "html-loader"
					}, {
						test : /\.(js|json)$/,
						exclude : /(node_modules|bower_components)/,
						loader: 'babel',
						query: {
							presets: ['es2015'],
							plugins: ['transform-runtime'],
							cacheDirectory : true
						}
					}]
				}
			}
		},
		uglify: {
			dist: {
				files : [{
					src : DIST_DIR + "/js/main.js",
					dest : DIST_DIR + "/js/main.js"
				}]
			}
		},
		
		sass: {
			dist : {
				files: [{
					src : SRC_DIR + "/scss/main.scss",
					dest : DIST_DIR + "/css/main.css"
				}]
			}
			
		},
		cssmin: {
			dist : {
				files : [{
					src : DIST_DIR + "/css/main.css",
					dest : DIST_DIR + "/css/main.css",
				}]
			}
		},
		
		sync: {
			dist : {
				files : [{
					expand: true,
					cwd: SRC_DIR,
					src: ["**/*", "!js/**/*", "!scss/**/*", "!js", "!scss"],
					dest: DIST_DIR
				}],
				verbose: true,
				failOnError: true,
				updateAndDelete: true,
				ignoreInDest: ["js/**/*", "css/**/*", "js", "css"],
				compareUsing: "md5"
			},
		},
		
		watch: {
			scss : {
				files : [SRC_DIR + "/scss/**/*"],
				tasks : ["buildCSS"],
				options : {
					interrupt : true
				}
			},
			js : {
				files : [SRC_DIR + "/js/**/*"],
				tasks : ["buildJS"],
				options : {
					interrupt : true
				}
			},
			other : {
				files : [SRC_DIR + "/**/*",
				"!" + SRC_DIR + "/js/**/*",
				"!" + SRC_DIR + "/scss/**/*",
				"!" + SRC_DIR + "/js",
				"!" + SRC_DIR + "/scss"],
				tasks : ["buildOther"],
				options : {
					interrupt : true
				}
			}
		},
		
		concurrent : {
			watch : {
				tasks : ["watch:scss", "watch:js", "watch:other"],
				options : {
					logConcurrentOutput : true
				}
			}
		}
	});

	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	
	//Parts
	grunt.registerTask('buildJS', ["webpack:dist"]);
	grunt.registerTask('buildCSS', ["sass:dist"]);
	grunt.registerTask('buildOther', ["sync:dist"]);
	
	grunt.registerTask('buildJSProd', ["buildJS", "uglify:dist"]);
	grunt.registerTask('buildCSSProd', ["buildCSS", "cssmin:dist"]);
	
	//Production builds
	grunt.registerTask('buildProd', ["buildOther", "buildJSProd", "buildCSSProd"]);
	
	//Dev builds & watching
	grunt.registerTask('buildDev', ["buildOther", "buildJS", "buildCSS"]);
	grunt.registerTask('dev', ["buildDev", "concurrent:watch"]);
};