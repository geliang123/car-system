import React, { Component } from 'react'
import { Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'

const { TabPane } = Tabs
@withRouter
class NavTop extends Component {
  state = {
    active: '1'
  }

  handleChange = tab => {
    this.setState({
      active: tab
    })
    switch (tab) {
      case '1':
        this.props.history.push('/liveCall')
        break
      case '2':
        this.props.history.push('/account')
        break
      case '3':
        this.props.history.push('/eventRecord')
        break
      default:
        break
    }
  }

  render() {
    const { active } = this.state
    return (
      <div className="top">
        <img className="logo" src={require('../images/home/logo.png')} />
        <Tabs onChange={this.handleChange} activeKey={active}>
          <TabPane tab="实时呼叫" key="1" />
          <TabPane tab="账号管理" key="2" />
          <TabPane tab="事件记录" key="3" />
        </Tabs>
        <div className="right-info">
          <img
            src={require('../images/home/logo.png')}
            className="user-image"
          />
          <div>张三</div>
          <div className="login-out">退出</div>
          <div className="status">
            <span className="circle sleep" />
            休息
          </div>
          <div className="tri" />
        </div>
      </div>
    )
  }
}

export default NavTop
