var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;

var pathsSass = {
    source : './sass/main.scss',
    destination: './css'
};
var pathsJS = {
    source : './js/script.js',
    destination: './js'
};
var pathsSW = {
    source : './sw.js',
    destination: './'
};

gulp.task('sass', () => {
    return gulp.src(pathsSass.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        grid: "autoplace"
    }))
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": false
    }))
    .pipe(gulp.dest(pathsSass.destination));
});

gulp.task('js', () => {
    return gulp.src(pathsJS.source)
    .pipe(rename("bundle.js"))
    .pipe(uglify())
    .pipe(gulp.dest(pathsJS.destination));
 });

gulp.task('sw', () => {
    return gulp.src(pathsSW.source)
    .pipe(rename("sw-bundle.js"))
    .pipe(uglify())
    .pipe(gulp.dest(pathsSW.destination));
 });