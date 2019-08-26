const React = require('react')
const resolvePath = (path) => require('path').resolve(process.cwd(), path)
const cdn = '/h5'
module.exports = {
  keys: 'eggssr',
  cdn: cdn,
  type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
  static: {
    prefix: cdn + '/',
    dir: resolvePath('dist')
  },
  routes: [
    {
      path: '/',
      exact: true,
      Component: () => (require('@/page/index').default), // 这里使用一个function包裹为了让它延迟require
      controller: 'page',
      handler: 'index'
    },
    {
      path: '/news/:id',
      exact: true,
//    Component: () => (require('@/page/news').default),
      Component: () => (__isBrowser__ ? require('../app/loadable').default({
        loader: () => import(/* webpackChunkName: "news" */ '@/page/news'),
        loading: function Loading () {
          return React.createElement('div')
        }
      }) : require('@/page/news').default
      ),
      controller: 'page',
      handler: 'index'
    }
  ],
  baseDir: resolvePath(''),
  injectCss: [
    `/static/css/Page.chunk.css`
  ], // 客户端需要加载的静态样式表
  injectScript: [
    `/static/js/runtime~Page.js`,
    `/static/js/vendor.chunk.js`,
    `/static/js/Page.chunk.js`
  ], // 客户端需要加载的静态资源文件表
  serverJs: resolvePath(`dist/Page.server.js`)
}
