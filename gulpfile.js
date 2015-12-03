var gulp = require('gulp'),
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
        styles: ['styles/**/*.scss'],
        images: ['styles/images/**/*']
    }
};

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

gulp.task('dev:run', ['dev:build:styles', 'dev:build:images'], function () {

    var app = express();
    app.use(express.static('static'));

    var server = app.listen(5000, function () {
    });

    gulp.watch(paths.app.styles, {interval: 500}, ['dev:build:styles']);
    gulp.watch(paths.app.images, {interval: 500}, ['dev:build:images']);
});
