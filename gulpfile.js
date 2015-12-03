var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    ngHtml2Js = require("gulp-ng-html2js"),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    path = require('path'),
    express = require('express');

var paths = {
    appName: 'Poker',
    dist: 'static/dist',
    vendor: {
        js: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-ui-router/release/angular-ui-router.min.js'
        ],
        css: [],
        fonts: []
    },
    app: {
        templates: ['app/**/*.html', '!app/*.html'],
        scripts: ['app/**/*.ts'],
        styles: ['styles/**/*.scss'],
        images: ['styles/images/**/*']
    }
};

var tsProject = ts.createProject('tsconfig.json', {
    out: paths.appName + '.js'
});

// Templates
gulp.task('dev:build:templates', function () {
    return gulp.src(paths.app.templates)
        .pipe(ngHtml2Js({
            moduleName: paths.appName,
            declareModule: false
        }))
        .pipe(concat(paths.appName + ".tpls.min.js"))
        .pipe(gulp.dest(paths.dist));
});

// Scripts
gulp.task('dev:build:scripts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write({
            sourceRoot: '/app'
        }))
        .pipe(gulp.dest(paths.dist));
});

// Styles
gulp.task('dev:build:styles', function () {
    return gulp.src(paths.app.styles)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist + '/css'));
});

// Images
gulp.task('dev:build:images', function () {
    return gulp.src(paths.app.images)
        .pipe(gulp.dest(paths.dist + '/images'));
});

// Vendor
gulp.task('dev:build:vendor', function () {
    return gulp.src(paths.vendor.js)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('dev:run', ['dev:build:templates', 'dev:build:scripts', 'dev:build:styles', 'dev:build:images', 'dev:build:vendor'], function () {

    var app = express();
    app.use('/app', express.static('app'));
    app.use(express.static('static'));

    var server = app.listen(5000, function () {
    });

    gulp.watch(paths.app.templates, {interval: 500}, ['dev:build:templates']);
    gulp.watch(paths.app.scripts, {interval: 500}, ['dev:build:scripts']);
    gulp.watch(paths.app.styles, {interval: 500}, ['dev:build:styles']);
    gulp.watch(paths.app.images, {interval: 500}, ['dev:build:images']);
});
