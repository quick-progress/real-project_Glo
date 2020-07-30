let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/css/*.css",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.*",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/css/**/*.css",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg, png, ico, webp, gif, svg}"
    },
    clean: "./" + project_folder + "/"
};

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    sass = require("gulp-sass"),
    gulpautoprefixer = require("gulp-autoprefixer"),
    gulpcleancss = require("gulp-clean-css"),
    gulprename = require("gulp-rename"),
    gulpuglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
};

function html() {
    return src(path.src.html)
        .pipe( fileinclude() )
        .pipe( dest(path.build.html) )
        .pipe( browsersync.stream() )
};

function fonts() {
    return src(path.src.fonts)
        .pipe( dest(path.build.fonts) )
};

function js() {
    return src(path.src.js)
        .pipe( fileinclude() )
        .pipe( dest(path.build.js) )
        .pipe( gulpuglify() )
        .pipe(
            gulprename({
                extname: ".min.js"
            })
        )
        .pipe( dest(path.build.js) )
        .pipe( browsersync.stream() )
};

function watchFiles(param) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
};

const clean = (param) => {
    return del(path.clean);
}

function css() {
    return src(path.src.css)
        /*.pipe(
            sass({
                outputStyle: "extended"
            })
        )
        .pipe( gulpautoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }) )
        .pipe( dest(path.build.css) )
        .pipe( gulpcleancss() )
        .pipe(
            gulprename({
                extname: ".min.css"
            })
        )*/
        .pipe( dest(path.build.css) )
        //.pipe( browsersync.stream() )
};

function images() {
    return src(path.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        /*.pipe (
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: true}],
                interlaced: true,
                optimizationLevel: 3
            })
        )*/
        .pipe( dest(path.build.img) )
        .pipe( browsersync.stream() )
};


let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;