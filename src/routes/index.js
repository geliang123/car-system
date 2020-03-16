import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import routes from './router'
import NavTop from './NavTop'
import './index.less'

@withRouter
class App extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  routeWithSubRoutes = (route, index) => (
    <Route
      key={index}
      exact={route.exact || false}
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  )

  isLogin = () => {
    const { location } = this.props
    if (location.pathname === '/' || location.pathname === '/Login') {
      return true
    }
    return false
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    })
    console.log(`报错信息:${error}`)
    console.log(`报错调用栈的组件: ${JSON.stringify(info)}`)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>网页出错啦，请返回</h1>
    }
    return (
      <div style={{ height: '100%' }}>
        {!this.isLogin() ? <NavTop /> : null}
        <Switch>
          {routes.map((route, index) => this.routeWithSubRoutes(route, index))}
        </Switch>
      </div>
    )
  }
}

export default App
