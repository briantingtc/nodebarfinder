'use strict';

var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require("gulp-uglify"),
    rename     = require("gulp-rename"),
    del        = require("del"),
    babel      = require('gulp-babel'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    streamify  = require('gulp-streamify');



gulp.task("concatBabel", function () {
  return gulp.src(['js/mapfunctions.js','js/mainreact.js'])
             .pipe(concat('main.js'))
             .pipe(babel())
             .pipe(gulp.dest("./"));
});


gulp.task('minifyBundle', function(){
  return gulp.src('bundle.js')
             .pipe(uglify())
             .pipe(rename('bundle.min.js'))
             .pipe(gulp.dest('./'));
});


// gulp concatBabel
// browserify main.js -o bundle.js
// gulp minifyBundle
// delete extra files






gulp.task('browserify', function() {
  var bundleStream = browserify('main.js').bundle()

  return bundleStream
          .pipe(source('main.js'))
          .pipe(streamify(uglify()))
          .pipe(rename('bundle.js'))
          .pipe(gulp.dest('./'));
});



gulp.task("buildClean", ["concatBabel","browserify"], function(){
  return del( "main.js" );
});
