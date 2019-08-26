import React from 'react'
import ReactDOM from 'react-dom'
import dva from 'dva'
import models from './models'
import { BrowserRouter, StaticRouter, Route, Switch } from 'react-router-dom'
import defaultLayout from '@/layout'
import { getWrappedComponent, getComponent } from './common/yk-utils/index'
import { routes as Routes } from '../config/config.default'
import { createMemoryHistory, createBrowserHistory } from 'history'
import { ConnectedRouter } from 'react-router-redux'

export const cdn = '/h5'

const initDva = (options) => {
  const app = dva(options)
  models.forEach(m => app.model(m))
  app.router(() => {})
  app.start()
  return app
}

const clientRender = () => {
  const initialState = window.__INITIAL_DATA__ || {}
  const history = createBrowserHistory()
  const app = initDva({
    initialState,
    history: history
  })
  const store = app._store

  app.router(() => (
    // ConnectedRouter for this issue https://github.com/ykfe/egg-react-ssr/issues/54
    <ConnectedRouter history={history}>
      <BrowserRouter basename={cdn}>
        <Switch>
          {
            Routes.map(({ path, exact, Component }) => {
              const ActiveComponent = Component()
              const Layout = ActiveComponent.Layout || defaultLayout
              return <Route exact={exact} key={path} path={path} render={() => {
                const WrappedComponent = getWrappedComponent(ActiveComponent)
                return <Layout><WrappedComponent store={store} /></Layout>
              }} />
            })
          }
        </Switch>
      </BrowserRouter>
    </ConnectedRouter>
  ))
  const DvaApp = app.start()

  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](<DvaApp />, document.getElementById('app'))

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

const serverRender = async ctx => {
  const app = initDva({
    history: createMemoryHistory({
      initialEntries: [ctx.req.url]
    })
  })
  const store = app._store
  ctx.store = store
  const ActiveComponent = getComponent(Routes, ctx.path)()
  const Layout = ActiveComponent.Layout || defaultLayout
  ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {} // eslint-disable-line
  const storeState = store.getState()
  ctx.serverData = storeState

  app.router(() => (
    <StaticRouter location={ctx.req.url} context={storeState}>
      <Layout layoutData={ctx}>
        <ActiveComponent {...storeState} />
      </Layout>
    </StaticRouter>
  ))

  const DvaApp = app.start()
  return <DvaApp />
}

export default __isBrowser__ ? clientRender() : serverRender
