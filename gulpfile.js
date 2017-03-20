// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed');
var minifyHTML = require('gulp-minify-html');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var bower = require('gulp-bower-files');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var jsonminify = require('gulp-jsonminify');

// minify new or changed HTML pages
gulp.task('minify-html', function() {
    var opts = {
        empty: true,
        quotes: true
    };
    var htmlPath = {
        htmlSrc: 'app/templates/**/*.html',
        htmlDest: './dist/assets/templates/'
    };
    return gulp.src(htmlPath.htmlSrc)
        .pipe(changed(htmlPath.htmlDest))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(htmlPath.htmlDest));
});

gulp.task('bundle-scripts-without-source', function() {
    var jsPath = {
        jsSrc: ['app/js/**/*.js'],
        jsDest: './dist/assets/js/'
    };
    gulp.src(jsPath.jsSrc)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(jsPath.jsDest))
        .pipe(connect.reload());
});

// JS concat, strip debugging code and minify
gulp.task('bundle-scripts', function() {
    var jsPath = {
        jsSrc: ['app/js/**/*.js'],
        jsDest: './dist/assets/js/'
    };
    gulp.src(jsPath.jsSrc)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsPath.jsDest))
        .pipe(connect.reload());
});

//bundle-css
gulp.task('scss', function() {
    gulp.src('app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css/'))
        .pipe(connect.reload());
});
gulp.task('bundle-css', function() {
    var cssPath = {
        cssSrc: ['app/css/*.css', '!*.min.css', '!/**/*.min.css'],
        cssDest: './dist/assets/css'
    };
    return gulp.src(cssPath.cssSrc)
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(cssPath.cssDest))
        .pipe(connect.reload());
});

//JSON-minify
gulp.task('JSONminify', function() {
    var jsonPath = {
        jsonSrc: ['app/json/*.json'],
        jsonDest: './dist/assets/json/'
    };
    return gulp.src(jsonPath.jsonSrc)
        .pipe(jsonminify())
        .pipe(gulp.dest(jsonPath.jsonDest));
});

//vendor-lib
gulp.task('vendor-lib', function() {
    return gulp.src(mainBowerFiles({
            filter: new RegExp('.*js$', 'i')
        }))
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'));
});

//vendor-lib
gulp.task('vendor-css', function() {
    return gulp.src(mainBowerFiles({
            filter: new RegExp('.*css$', 'i')
        }))
        .pipe(concat('vendor.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('copyfiles', function() {
    gulp.src('app/images/**/*')
        .pipe(gulp.dest('./dist/assets/images'));
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('./dist/assets/fonts'));
    gulp.src('app/templates/**/*.hbs')
        .pipe(gulp.dest('./dist/assets/templates/'));
});
gulp.task('copyIndex', function() {
    gulp.src('app/index.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

// default gulp task
gulp.task('watch', function() {
    // watch for HTML changes
    gulp.watch('app/js/templates/**/*.html', ['minify-html']);
    // watch for JS changes
    gulp.watch('app/js/**/*.js', ['bundle-scripts']);
    // watch for SCSS changes
    gulp.watch('app/scss/**/*.scss', ['scss']);
    // watch for CSS changes
    gulp.watch('app/css/*.css', ['bundle-css']);
    // watch for JSON changes
    gulp.watch('app/json/*.json', ['JSONminify']);
    // watch for index.html
    gulp.watch('app/index.html', ['copyIndex']);
    // watch for hbs.html
    gulp.watch('app/templates/**/*.hbs', ['copyfiles']);
});

gulp.task('default', ['minify-html', 'vendor-lib', 'vendor-css', 'bundle-scripts', 'scss', 'bundle-css', 'JSONminify', 'copyfiles', 'copyIndex', 'webserver', 'watch']);

gulp.task('webserver', function() {
    connect.server({
        root: "dist",
        livereload: true,
        port: 9090
    });
});

gulp.task('dev', ['minify-html', 'vendor-lib', 'vendor-css', 'bundle-scripts', 'bundle-css', 'JSONminify', 'copyfiles', 'copyIndex']);

gulp.task('prod', ['minify-html', 'vendor-lib', 'vendor-css', 'bundle-scripts-without-source', 'bundle-css', 'JSONminify', 'copyfiles', 'copyIndex']);
