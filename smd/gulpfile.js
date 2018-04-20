/*
 npm i gulp gulp-sass gulp-clean-css gulp-uglify gulp-rename gulp-changed --save-dev
 ^^^^^^^^^^^^^^^^
 Run this to get all dependencies for file
*/

// dependencies
let gulp = require('gulp');
let sass = require('gulp-sass');
let minifyCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let changed = require('gulp-changed');


/*
* SCSS/ CSS
*/

let SCSS_SRC = './src/Assets/scss/**/*.scss';
let SCSS_DEST = './src/Assets/css';

// Compile SCSS
gulp.task('compile_scss', () => {

  gulp.src(SCSS_SRC)
  .pipe(sass().on('error', sass.logError))
  .pipe(minifyCSS())
  .pipe(rename({ suffix: '.min'}))
  .pipe(changed(SCSS_DEST))
  .pipe(gulp.dest(SCSS_DEST));

});

// Detect changes in SCSS
gulp.task('watch_scss', () => {
  gulp.watch(SCSS_SRC, ['compile_scss']);
});

// Run tasks
gulp.task('default', ['watch_scss']);
