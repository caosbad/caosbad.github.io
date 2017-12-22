var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var del = require('del');

gulp.task('resize',['del'], function () {
    return gulp.src('images/origin/*.*')
        .pipe(imageResize({
            width: 1024,
            imageMagick: true
        }))
        .pipe(gulp.dest('images/fulls'))
        .pipe(imageResize({
            width: 512,
            imageMagick: true
        }))
        .pipe(gulp.dest('images/thumbs'));
});

gulp.task('del',function () {
    return del(['images/fulls/*.*','images/thumbs/*.*']);
});

gulp.task('default', ['del','resize']);