const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const scss = require('gulp-sass'),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync').create(),
      uglify = require('gulp-uglify-es').default,
      autoprefixer = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      del = require('del'),
      webp = require('gulp-webp'),
      svgstore = require('gulp-svgstore'),
      htmlmin = require('gulp-htmlmin'),
      imgCompress  = require('imagemin-jpeg-recompress'),
      posthtml = require("gulp-posthtml"),
      include = require("posthtml-include");

function html() {
  return src('app/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function htmlInclude() {
  return src("dist/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(dest('dist'));
}

function webpConvert() {
  return src('app/img/content/*.{png,jpg}')
  .pipe(webp())
  .pipe(dest('app/img/webp'));
}

function sprite() {
  return src('app/img/icons/icon-*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(concat('sprite.svg'))
  .pipe(dest('dist/img'));
}


function cleanDist() {
  return del('dist');
}

function images() {
  return src('app/img/**/*')
  .pipe(imagemin([
    imgCompress({
      loops: 4,
      min: 70,
      max: 80,
      quality: 'high'
    }),
    imagemin.gifsicle(),
    imagemin.optipng(),
    imagemin.svgo()
  ]))
  .pipe(dest('dist/img'));
}

function scripts() {
  return src([
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream());
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function build() {
  return src([
    'app/css/*.css',
    'app/fonts/**/*',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/main.js','!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.webpConvert = webpConvert;
exports.sprite = sprite;
exports.htmlInclude = htmlInclude;


exports.build = series(cleanDist, build, images, html);
exports.default = parallel(styles, scripts, browsersync, watching);
