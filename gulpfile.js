/*

=========================================================

* Pinnacle Bootstrap 5 UI Kit

* Copyright 2022 Themesin https://themesin.com/

* Created by https://themesin.com/

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software. Contact us if you want to remove it.

*/

const autoPrefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const cleanCss = require("gulp-clean-css");
const gulp = require("gulp");
const npmDist = require("gulp-npm-dist");
const sass = require("gulp-sass");
const wait = require("gulp-wait");
const sourceMaps = require("gulp-sourcemaps");
const fileInclude = require("gulp-file-include");
const uglify = require("gulp-uglify");
const del = require("del");
const concat = require("gulp-concat");
const htmlMin = require("gulp-htmlmin");

const paths = {
  build: {
    css: "./build/assets/css",
    js: "./build/assets/js",
    sections: "./build/sections",
    pages: "./build/pages",
    components: "./build/components",
    base: "./build",
    vendor: "./build/assets/vendor",
    assets: "./build/assets/",
  },

  dev: {
    css: "./dev/assets/css",
    sections: "./dev/sections",
    pages: "./dev/pages",
    components: "./dev/components",
    base: "./dev",
    vendor: "./dev/assets/vendor",
    assets: "./dev/assets/",
  },

  dist: {
    css: "./dist/assets/css",
    js: "./dist/assets/js",
    sections: "./dist/sections",
    pages: "./dist/pages",
    components: "./dist/components",
    base: "./dist",
    vendor: "./dist/assets/vendor",
    assets: "./dist/assets/",
  },

  root: {
    base: "./",
    node: "./node_modules",
  },

  src: {
    base: "./src",
    sections: "./src/sections/**/*.html",
    pages: "./src/pages/**/*.html",
    components: "./src/components/*.html",
    js: "./src/assets/js/*.js",
    partials: "./src/partials/**/*.html",
    scss: "./src/scss/**/*.scss",
    vendor: "./src/assets/vendor/**/**.js",
    assets: "./src/assets/**/*.*",
  },
};

gulp.task("scss", function () {
  return gulp
    .src(paths.src.scss)
    .pipe(wait(500))
    .pipe(sourceMaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ["> 0.5%"],
      })
    )
    .pipe(sourceMaps.write("."))
    .pipe(gulp.dest(paths.dev.css))
    .pipe(browserSync.stream());
});

gulp.task("assets", function () {
  return gulp
    .src(paths.src.assets)
    .pipe(gulp.dest(paths.dev.assets))
    .pipe(browserSync.stream());
});

gulp.task("clear", function () {
  return del([paths.dev.base]);
});

gulp.task("index", function () {
  return gulp
    .src(paths.src.base + "/*.{html,ico}")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "development",
        },
      })
    )
    .pipe(gulp.dest(paths.dev.base))
    .pipe(browserSync.stream());
});

gulp.task("sections", function () {
  return gulp
    .src(paths.src.sections)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "development",
        },
      })
    )
    .pipe(gulp.dest(paths.dev.sections))
    .pipe(browserSync.stream());
});

gulp.task("pages", function () {
  return gulp
    .src(paths.src.pages)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "development",
        },
      })
    )
    .pipe(gulp.dest(paths.dev.pages))
    .pipe(browserSync.stream());
});

gulp.task("components", function () {
  return gulp
    .src(paths.src.components)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "development",
        },
      })
    )
    .pipe(gulp.dest(paths.dev.components))
    .pipe(browserSync.stream());
});

gulp.task("vendor", function () {
  return gulp
    .src(
      npmDist({
        excludes: ["/**/*.svg", "/@fortawesome/fontawesome-free/js/**/*"],
      }),
      {
        base: paths.root.node,
      }
    )
    .pipe(gulp.dest(paths.dev.vendor));
});

gulp.task(
  "launch",
  gulp.series(
    "clear",
    "assets",
    "scss",
    "sections",
    "components",
    "pages",
    "index",
    "vendor",
    function () {
      browserSync.init({
        server: "./dev",
      });

      gulp.watch(paths.src.scss, gulp.series("scss"));
      gulp.watch(
        [
          paths.src.sections,
          paths.src.components,
          paths.src.pages,
          paths.src.partials,
          "src/*.html",
        ],
        gulp.series("sections", "components", "pages", "index")
      );
      gulp.watch(paths.src.assets, gulp.series("assets"));
      gulp.watch(paths.src.vendor, gulp.series("vendor"));
    }
  )
);

// build tasks

gulp.task("build:clear", function () {
  return del([paths.build.base]);
});

gulp.task("build:css", function () {
  return gulp
    .src(paths.src.scss)
    .pipe(wait(500))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ["> 1%"],
      })
    )
    .pipe(gulp.dest(paths.build.css));
});

gulp.task("build:assets", function () {
  return gulp.src(paths.src.assets).pipe(gulp.dest(paths.build.assets));
});

gulp.task("build:vendor", function () {
  return gulp
    .src(
      npmDist({
        excludes: ["/**/*.svg", "/@fortawesome/fontawesome-free/js/**/*"],
      }),
      {
        base: paths.root.node,
      }
    )
    .pipe(gulp.dest(paths.build.vendor));
});

gulp.task("build:index", function () {
  return gulp
    .src(paths.src.base + "/*.{html,ico}")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.build.base));
});

gulp.task("build:sections", function () {
  return gulp
    .src(paths.src.sections)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.build.sections));
});

gulp.task("build:pages", function () {
  return gulp
    .src(paths.src.pages)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.build.pages));
});

gulp.task("build:components", function () {
  return gulp
    .src(paths.src.components)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.build.components));
});

// dist Tasks

gulp.task("dist:clear", function () {
  return del([paths.dist.base]);
});

gulp.task("dist:css", function () {
  return gulp
    .src(paths.src.scss)
    .pipe(wait(500))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ["> 0.5%"],
      })
    )
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task("dist:assets", function () {
  return gulp.src(paths.src.assets).pipe(gulp.dest(paths.dist.assets));
});

gulp.task("dist:vendor", function () {
  return gulp
    .src(
      npmDist({
        excludes: ["/**/*.svg", "/@fortawesome/fontawesome-free/js/**/*"],
      }),
      {
        base: paths.root.node,
      }
    )
    .pipe(gulp.dest(paths.dist.vendor));
});

gulp.task("dist:index", function () {
  return gulp
    .src(paths.src.base + "/*.{html,ico}")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.dist.base));
});

gulp.task("dist:sections", function () {
  return gulp
    .src(paths.src.sections)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.dist.sections));
});

gulp.task("dist:pages", function () {
  return gulp
    .src(paths.src.pages)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.dist.pages));
});

gulp.task("dist:components", function () {
  return gulp
    .src(paths.src.components)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/partials",
        context: {
          environment: "production",
        },
      })
    )
    .pipe(gulp.dest(paths.dist.components));
});

gulp.task("dist:minify:css", function () {
  return gulp
    .src(paths.dist.css + "/*.css")
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task("dist:minify:js", function () {
  return gulp
    .src(paths.dist.js + "/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task("dist:minify:vendor", function () {
  return gulp
    .src(paths.dist.vendor + "/**/*.js")
    .pipe(concat("themesin-vendor.min.js"))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task("dist:minify:html", function () {
  return gulp
    .src(paths.dist.base + "/**/*.html")
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest(paths.dist.base));
});

gulp.task(
  "dist",
  gulp.series(
    "dist:clear",
    "dist:css",
    "dist:assets",
    "dist:vendor",
    "dist:sections",
    "dist:components",
    "dist:pages",
    "dist:index",
    "dist:minify:css",
    "dist:minify:js",
    "dist:minify:vendor",
    "dist:minify:html"
  )
);

gulp.task(
  "build",
  gulp.series(
    "build:clear",
    "build:css",
    "build:assets",
    "build:vendor",
    "build:sections",
    "build:components",
    "build:pages",
    "build:index"
  )
);

gulp.task("default", gulp.series("launch"));
