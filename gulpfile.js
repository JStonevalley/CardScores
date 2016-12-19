const gulp = require("gulp");
const babel = require('gulp-babel');
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon')

const tsProject = ts.createProject("tsconfig.json");

gulp.task("scripts", function () {
  const tsResult = tsProject.src()
  .pipe(sourcemaps.init())
  .pipe(tsProject());
  return tsResult.js
  .pipe(sourcemaps.write('.', {
    sourceRoot: function(file){ return file.cwd + '/src'; }
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch-changes-to-compile', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('watch-changes-to-run', function () {
  nodemon({
    script: 'dist/index.js'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('default', ['watch-changes-to-compile', 'watch-changes-to-run']);