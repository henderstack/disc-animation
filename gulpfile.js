const gulp = require('gulp');
const connect = require('gulp-connect');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const sass = require('gulp-ruby-sass');
const del = require('del');
const livereload = require('gulp-livereload');
const paths = {
        pug: ['src'],
        style_sass: 'src/sass'
    };
const LOCAL_SERVER_PORT = 4000;


gulp.task('server', () => 
    connect.server({
        port: LOCAL_SERVER_PORT,
        root: './dist',
        livereload: true
    })
);

gulp.task('html', () =>
    gulp.src('src/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./dist'))
);

gulp.task('styles', () =>
        sass('./src/**/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('./dist'))
);

gulp.task('js', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    livereload.listen({
        start: true,
        reloadPage: 'index.html'
    })
    gulp.watch(paths.pug + '*.pug', ['pug:watch'])
    gulp.watch(paths.style_sass + '*.scss', ['sass:watch'])
});

gulp.task('pug:watch', () => 
    gulp.src('src/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./dist'))
);

gulp.task('sass:watch', () =>
    gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/styles'))
);

gulp.task('dev', ['clean', 'html', 'styles', 'js', 'server', 'watch']);

gulp.task('default', ['dev']);

gulp.task('clean', function() {
    return del([
    'dist/**/*',
  ]);
});