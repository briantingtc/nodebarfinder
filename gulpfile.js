'use strict';

var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require("gulp-uglify"),
    rename     = require("gulp-rename"),
    sass       = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    del        = require("del"),
    babel      = require('gulp-babel');



gulp.task("babel", function () {
  return gulp.src(['js/mapfunctions.js','js/main.js'])
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(gulp.dest("js"));
});

gulp.task("concatScripts", function(){
  return gulp.src([
            'js/jquery.js',
            'js/sticky/jquery.sticky.js',
            'js/main/js'])
            .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts',["concatScripts"], function(){
  return gulp.src('js/app.js')
          .pipe(uglify())
          .pipe(rename('app.min.js'))
          .pipe(gulp.dest('js'));
});

gulp.task('minifyBundle', function(){
  return gulp.src('bundle.js')
              .pipe(uglify())
              .pipe(rename('bundle.min.js'))
              .pipe(gulp.dest('./'));
});

gulp.task('compileSass', function(){
  return gulp.src('scss/application.scss')
          .pipe(sourcemaps.init())
          .pipe(sass())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('css'));
});

gulp.task('watchSass', function(){
  gulp.watch(['/scss/**/*.scss'], ['compileSass']);
});

gulp.task("clean", function(){
  del(['dist', "css/application.css*", "js/app*.js*" ]);
});

gulp.task("build",['minifyScripts', 'compileSass'], function(){
  return gulp.src(["css/application.css", "js/app.min.js", "index.html",
                   "img/**", "fonts/**"], { base: "./" })
                   .pipe(gulp.dest('dist'));
});

gulp.task("default", ['build']);
