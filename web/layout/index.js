
import React from 'react'
import '@/assets/common.less'
import './index.less'
import { Link } from 'react-router-dom'
import serialize from 'serialize-javascript'

const commonNode = props => (
  // 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ? { props.children } : ''
  props.children ? <div className='normal'><h1 className='title'><Link to='/'>Egg + React + SSR</Link><div className='author'>by ykfe</div></h1>{props.children}</div>
    : ''
)

const Layout = (props) => {
  if (__isBrowser__) {
    return commonNode(props)
  } else {
  	const PUBLIC_URL = process.env.PUBLIC_URL
    const { serverData } = props.layoutData
    const { injectCss, injectScript } = props.layoutData.app.config
    return (
	      <html lang='en'>
	        <head>
		        <meta charSet="utf-8"/>
				    <meta name="viewport"
				    content="width=device-width, viewport-fit=cover, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"/>
				    <meta name="apple-touch-fullscreen" content="yes"/>
				    <meta name="apple-mobile-web-app-capable" content="yes"/>
				    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
				    <meta name="format-detection" content="telephone=no"/>
				    <meta name="x5-fullscreen" content="true"/>
				    <meta name="full-screen" content="yes"/>
				    <meta name="theme-color" content="#000000"/>
				    <title>一宿酒店无线官网</title>
	          <link rel="shortcut icon" href={`${PUBLIC_URL}/static/tittle_logo.ico`} /> 
	          {
	            injectCss && injectCss.map(item => <link rel='stylesheet' href={`${PUBLIC_URL}${item}`} key={item} />)
	          }
	        </head>
	        <body>
	          <div id='app'>{ commonNode(props) }</div>
	          {
	            serverData && <script dangerouslySetInnerHTML={{
	              __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(serverData)}`
	            }} />
	          }
	          {
	          	injectScript && injectScript.map((item) => <script type="text/javascript" src={`${PUBLIC_URL}${item}`} key={item}></script>)
	          }
	        </body>
	      </html>
    )
  }
}

export default Layout
