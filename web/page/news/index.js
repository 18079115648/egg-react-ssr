import React from 'react'
import { connect } from 'dva'
import './index.less'
import axios from 'axios'

function News (props) {
  return <div className='news-container'>
    文章详情: {props.detail}
  </div>
}

News.getInitialProps = async (ctx) => {
	console.log(111113333)
  const newsId = __isBrowser__ ? ctx.match.params.id : ctx.params.id
  await ctx.store.dispatch({ type: 'news/getData', payload: { id: newsId } })
}

const mapStateToProps = (state) => ({
  detail: state.news.detail
})

export default connect(mapStateToProps)(News)
