var webpack = require("webpack");

module.exports = {
	entry: "./app.js",
	output: {
		path: __dirname + "/app",
		filename: "app.js",
	},
	devServer: {
		inline: true,
		contentBase: './app',
		port: 5000,
		historyApiFallback : true
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!autoprefixer-loader'
			},
			{ 	test: /\.html$/, 
			  	loader: 'ngtemplate-loader!html-loader'
		    },
		    {
		    	test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
		    }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
   ]
}
