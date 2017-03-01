const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	entry: [
		'./assets/main.js',
	],
	output: {
		filename: 'main.js',
		path: path.join( __dirname, 'build' ),
	},
	module: {
		rules: [
			{
				test: /\.js/,
				include: [
					path.join( __dirname, 'assets' ),
				],
				loader: 'babel-loader',
				options: {
					presets: ['react']
				}
			}
		]
	},
	plugins: [],
};

if ( process.env.NODE_ENV === 'development' ) {
	module.exports.entry.unshift(
		// 'webpack-dev-server/client?http://localhost:8080',
		// 'webpack/hot/only-dev-server'
	);

	module.exports.devServer = {
		hot: true,
		overlay: true,
		// contentBase: path.join( __dirname, 'build' ),
		// publicPath: '/',
		publicPath: "http://localhost:8080/",
		stats: "verbose"
	};
	module.exports.output.publicPath = "http://localhost:8080/";
	module.exports.plugins.push(
		new webpack.HotModuleReplacementPlugin()
	);
}
