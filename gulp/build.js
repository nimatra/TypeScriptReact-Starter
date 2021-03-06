const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');

requireDir('./', { recurse: true });

const buildBrowserify = browserify({
  basedir: '.',
  debug: true,
  entries: ['src/index.ts'],
  cache: {},
  packageCache: {},
}).plugin(tsify)
  .transform('babelify', {
    presets: ['es2015', 'react'],
    extensions: ['.ts'],
  })
  .bundle()
  .pipe(source('index.js'))
  .pipe(buffer());

function build() {
  const result = buildBrowserify
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
  buildBrowserify.on('log', gutil.log);
  return result;
}
// todo: add delete path
gulp.task('build', () => {
  runSequence('clean-build', ['static-build', 'eslint', 'tslint']);
  return build();
});
