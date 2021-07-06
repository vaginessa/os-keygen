import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import env from "postcss-preset-env";
import babel from "@rollup/plugin-babel";
import livereload from "rollup-plugin-livereload";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy-watch";
import { minify } from "html-minifier-terser";
import serve from "rollup-plugin-serve";
import postcssCopy from "postcss-copy";

const production = !process.env.ROLLUP_WATCH;

const htmlconfig = {
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: true,
	collapseWhitespace: true,
	decodeEntities: true,
	includeAutoGeneratedTags: false,
	minifyURLs: true,
	preventAttributesEscaping: true,
	processConditionalComments: true,
	quoteCharacter: '"',
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeOptionalTags: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true,
	trimCustomFragments: true,
	useShortDoctype: true
};

export default {
	input: "src/main.js",
	output: {
		file: "public/main.js",
		format: "iife",
		sourcemap: !production
	},
	plugins: [
		resolve(),
		commonjs(),
		postcss({
			extract: true,
			minimize: production,
			plugins: [env(), postcssCopy({ dest: "public" })]
		}),
		babel({
			exclude: "node_modules/**",
			babelHelpers: "bundled",
			presets: ["@babel/preset-env"]
		}),
		json(),
		copy({
			targets: [
				{
					src: "src/index.html",
					dest: "public",
					transform:
						production &&
						((contents) => minify(contents.toString(), htmlconfig))
				},
				{
					src: "src/favicon.ico",
					dest: "public"
				}
			],
			watch: !production && "src/index.html"
		}),
		production &&
			terser({
				compress: {
					unsafe: true
				}
			}),
		!production && serve({ open: true, contentBase: "public", port: 3000 }),
		!production && livereload("public")
	]
};
