const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('copy-key', () => {
  return gulp.src(['key/*.json'])
    .pipe(gulp.dest('bin'));
});

gulp.task('copy-package', () => {
  return gulp.src(['package.json'])
    .pipe(gulp.dest('bin'));
});

gulp.task('default', ['lint', 'copy-key', 'copy-package'], () => {
  return gulp.src(['src/**/*.js'])
    .pipe(babel({
      presets: ['airbnb'],
    }))
    .pipe(gulp.dest('bin'));
});
