import  * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {deleteAsync, deleteSync} from 'del';
import gulp from 'gulp';
import browserSync from 'browser-sync';

const sync = browserSync.create()

const paths = {
    styles: {
      src: 'src/sass/style.scss',
      dest: 'build/styles/'
    },
    scripts: {
      src: 'src/scripts/**/*.js',
      dest: 'build/scripts/'
    },
    html: {
      src: 'src/*.html',
      dest: 'build/'
    },
    images: {
      src: 'src/image/**/*.(png|svg|jpg)',
      dest: 'build/image/'
    },
};

const sass = gulpSass(dartSass)

export const clean = () => deleteAsync([ 'build' ]);

export const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(sync.stream());
}

export const html = () => {
    return  gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(sync.stream());
}

export const images = () => {
    return  gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
}

const server = (done) => {
    sync.init({
        server: {
            baseDir: "build"
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
  }

const reload = (done) => {
    sync.reload();
    done();
}

export const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(sync.stream());
}

const watcher = () => {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, gulp.series(html, reload));;
}

gulp.task(
    'build',
    gulp.series(
        gulp.series(clean, styles, html, images),
        gulp.series(server, watcher)
    )
)



