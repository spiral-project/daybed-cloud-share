/* jshint node:true */

"use strict";

var gulp = require("gulp");
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
//var uglify = require('gulp-uglify'); Deactivate uglify for now since we
//cannot deploy with it.
var webserver = require("gulp-webserver");
var deploy = require("gulp-gh-pages");
var rename = require("gulp-rename");

var opt = {
  outputFolder: "build",

  server: {
    host: "0.0.0.0",
    port: 4000,
    livereload: true,
    open:false
  },

  config: {
    dev: "src/config/dev.js",
    prod: "src/config/prod.js",
    cname: "CNAME"
  },

  cssAssets: [
    "src/css/bootstrap.min.css",
    "src/css/font-awesome.min.css",
    "src/css/cloud-share.css"
  ],

  fontAssets: [
    "src/fonts/*"
  ],

  jsAssets: [
    "src/js/**/*.*"
  ],

  htmlAssets: [
    "src/index.html"
  ],

  app: {
    src: "src/js/cloud-share.js",
    dest: "cloud-share.js"
  },
  vendors: "vendors.js"
};

/**
 * Assets tasks
 */
gulp.task("assets", [
  "assets:html",
  "assets:fonts",
  "assets:css"
]);

gulp.task("assets:html", function() {
  return gulp.src(opt.htmlAssets)
    .pipe(gulp.dest(opt.outputFolder));
});

gulp.task("assets:css", function() {
  return gulp.src(opt.cssAssets)
    .pipe(gulp.dest(opt.outputFolder + "/css"));
});

gulp.task("assets:fonts", function() {
  return gulp.src(opt.fontAssets)
    .pipe(gulp.dest(opt.outputFolder + "/fonts"));
});

/**
 * JS tasks
 */

gulp.task("js", [
  "js:vendors",
  "js:app"
  ]);

gulp.task("js:app", ["js:vendors"], function() {
  return browserify("./" + opt.app.src)
    .transform("reactify")
    .external("react")
    .external("react-bootstrap")
    .bundle()
    .pipe(source(opt.app.dest))
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});

gulp.task("js:vendors", function() {
  return browserify()
    .require("react")
    .require("react-bootstrap")
    .bundle()
    .pipe(source(opt.vendors))
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});


/**
 * Server task
 */
gulp.task("server", function() {
   return gulp.src(opt.outputFolder)
    .pipe(webserver(opt.server));
});

/**
 * Watchify
 */

gulp.task("watchify", function(){

  var b = browserify( "./" + opt.app.src , watchify.args)
    .transform("reactify")
    .external("react")
    .external("react-bootstrap")


  function updateBundle(w){

    return w.bundle()
      .pipe(source(opt.app.dest))
      .pipe(gulp.dest(opt.outputFolder + "/js"));
  }

  var watcher= watchify(b);
  watcher.on("update", function(){
    updateBundle(watcher);
  });

  return updateBundle(watcher);

});

/**
 * Copy the right configuration file into js/config.js.
 **/
gulp.task("config-dev", function() {
  return gulp.src(opt.config.dev)
    .pipe(rename("config.js"))
    .pipe(gulp.dest(opt.outputFolder + "/js/"));
});

gulp.task("config-prod", function() {
  return gulp.src(opt.config.prod)
    .pipe(rename("config.js"))
    .pipe(gulp.dest(opt.outputFolder + "/js/"));
});

gulp.task("cname", function() {
  return gulp.src(opt.config.cname)
    .pipe(gulp.dest(opt.outputFolder));
});


/**
 * Watch task
 * Launch a server with livereload
 */
gulp.task("watch", ["assets","js:vendors", "config-dev", "watchify"],
  function() {
    gulp.watch(opt.cssAssets,  ["assets:css"]);
    gulp.watch(opt.fontAssets, ["assets:fonts"]);
    gulp.watch(opt.htmlAssets, ["assets:html"]);
});

gulp.task("dist", ["assets", "js", "config-prod"], function() {
  return gulp.src(opt.outputFolder + "/js/*.js")
    //.pipe(uglify())
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});

/**
 * Deploy to gh-pages
 */
gulp.task("deploy", ["dist", "cname"], function() {
  gulp.src("./build/**/*")
    .pipe(deploy("git@github.com:spiral-project/daybed-cloud-share.git"));
});

gulp.task("default", ["server", "watch"]);
