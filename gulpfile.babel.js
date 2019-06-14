import { watch, src, dest, series, parallel } from "gulp";
import sass, { logError } from "gulp-sass";
import { argv } from "yargs";
import cleanCss from "gulp-clean-css";
import gulpif from "gulp-if";
import { init, write } from "gulp-sourcemaps";
import del from "del";
import webpack from 'webpack-stream';
import { name } from "./package.json";

const PRODUCTION = argv.prod;
const sassSource = "src/sass/**/*.scss";
const devOutput = "html/wp-content/themes/" + name;
const distOutput = "dist/" + name;

export const styles = () => {
  return src(sassSource)
            .pipe(gulpif(!PRODUCTION, init()))
            .pipe(sass().on("error", logError))
            .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
            .pipe(gulpif(!PRODUCTION, write()))
            .pipe(gulpif(!PRODUCTION, dest(devOutput), dest(distOutput)) );
}

export const scripts = () => {
  return src('src/js/site.js')
  .pipe(webpack({
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: []
            }
          }
        }
      ]
    },
    mode: PRODUCTION ? 'production' : 'development',
    devtool: !PRODUCTION ? 'inline-source-map' : false,
    output: {
      filename: 'site.js'
    },
  }))
  .pipe(gulpif(!PRODUCTION, dest(devOutput + '/js'), dest(distOutput + '/js')));
}

export const copy = () => {
  return src(['src/**/*', '!src/{sass,js}', '!src/{sass,js}/**/*'])
            .pipe(gulpif(!PRODUCTION, dest(devOutput), dest(distOutput)));
}

export const clean = () => del(!PRODUCTION ? devOutput : distOutput);

export const watchForChanges = () => {
  watch(sassSource, styles);
  watch(['src/**/*', '!src/{sass,js}', '!src/{sass,js}/**/*'], copy)
  watch('src/js/**/*.js', scripts);
}

export const dev = series(clean, parallel(styles, scripts, copy), watchForChanges)
export const build = series(clean, parallel(styles, scripts, copy))
const _default = dev;
export { _default as default };
