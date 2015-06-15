var gulp = require('gulp'),
	connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');


gulp.task('script', function() {
	browserify({
		entries: ['./src/main.js']
	})
	.bundle()
	.pipe(source('multiplayer-game.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest("./build/"));
});

gulp.task('copy', ["script"], function() {
	return gulp.src( 'build/*.js'  ).pipe( gulp.dest( 'examples/libs' ) );
});

gulp.task('serve', ["copy"], function() {
  return connect.server({
    root: 'examples',
    host: 'localhost',
    port : 5000
  });
});

gulp.task('build', ['copy']);
