const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rev = require('gulp-rev');

const ONLY_JS_AND_CSS_FILE_EXTENSIONS = /(?:\.js|\.css)$/;

/**
 * TODO: Should probably have a way to know which new files were created.
 */
gulp.task('rev-files', () =>
    gulp.src('other/**')
        .pipe(gulpIf(ONLY_JS_AND_CSS_FILE_EXTENSIONS, rev()))
        .pipe(gulp.dest('build'))
);

gulp.task('copy-only', () => 
    gulp.src('copy-only/**')
        .pipe(gulp.dest('build'))
);

gulp.task('default', ['rev-files', 'copy-only']);
