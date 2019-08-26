"use strict";
// 本文件目的是以React jsx 为模版替换掉html-webpack-plugin以及传统模版引擎, 统一ssr/csr都使用React组件来作为页面的骨架和内容部分
const NODE_ENV = process.env.NODE_ENV;
process.env.NODE_ENV = (NODE_ENV === 'development') ? 'development' : 'production';
const webpack = require('webpack');
const openBrowser = require('react-dev-utils/openBrowser');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const fs = require('fs');
const promisify = require('util').promisify;
const webpackWithPromise = promisify(webpack);
const cwd = process.cwd();
const WebpackDevServer = require('webpack-dev-server');
const clientConfig = require(cwd + '/build/webpack.config.client');

const string = require('./renderLayout');
const host = 'localhost';
const port = 8000;

const dev = () => {
    const compiler = webpack(clientConfig);
    const server = new WebpackDevServer(compiler, {
        quiet: true,
        disableHostCheck: true,
        historyApiFallback: {
        	disableDotRule: true,
        },
        publicPath: '/',
        hotOnly: true,
        host: host,
//      contentBase: cwd + '/dist',
				open: true,
        hot: true,
        port: port,
        clientLogLevel: 'error',
        headers: {
            'access-control-allow-origin': '*'
        },
        before(app) {
            app.get(/^\/h5\/((?!\.).)*$/, async (req, res) => {
                res.write(string);
                res.end();
            });
//          app.get('/h5/*', async (req, res) => {
//              res.write(string);
//              res.end();
//          });
        }
    });
    server.listen(8000, 'localhost', () => {
    		const urls = prepareUrls('http', host, port);
    		console.log('Starting server on http://localhost:8000');
    		openBrowser(urls.localUrlForBrowser);
        
    });
};
const build = async () => {
    const stats = await webpackWithPromise(clientConfig);
    console.log(stats.toString({
        assets: true,
        colors: true,
        hash: true,
        timings: true,
        version: true
    }));
    fs.writeFileSync(cwd + '/dist/index.html', string);
};

NODE_ENV === 'development' ? dev() : build()
//module.exports = {
//  dev,
//  build
//};
