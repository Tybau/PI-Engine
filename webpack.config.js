var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCss = new ExtractTextPlugin('bundle.css')

module.exports = {
	entry : {
		app : ['./src/app.js']
	},
	output : {
		path : __dirname + '/dist',
		filename : 'bundle.js',
		publicPath : '/dist/'
	},
	module : {
		loaders : [
			{
				test : /\.js$/,
				loader : 'babel',
				exclude : /(node_modules|bower_components)/,
				include : __dirname
			},{
				test : /\.css$/,
				loader : extractCss.extract(['css'])
			},{
				test : /\.(frag|vert)$/,
				loader : 'webpack-glsl'
			},{
				test : /\.(obj)$/,
				loader : 'webpack-glsl'
			},{
				test : /\.(jpg|png|gif|svg)$/,
				loader : 'image-webpack'
			}
		]
	},
	plugins : [
		extractCss
	]
}
