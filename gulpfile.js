var gulp   = require('gulp');
var jshint = require('gulp-jshint');

// tasks
gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js', 'www/js/*.js', 'www/spec/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// default

gulp.task('default', ['lint'], function() {
  gulp.watch(['www/js/*.js', 'www/test/*.js'], function() {
    gulp.run('lint');
  });
});
