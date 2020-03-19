import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import fetch from '~/utils/fetch'
import { removeStore } from '~/utils/index'
import urlCng from '~/config/url'
import './index.less'

@withRouter
class NavTop extends Component {
  state = {
    key: 'account'
  }

  handleChange = tab => {
    this.setState({
      key: tab
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

  handleClick = e => {
    this.setState({
      key: e.key
    })
  }

  logout = () => {
    fetch({
      url: urlCng.logout,
      method: 'POST'
    }).then(res => {
      if (res.code === 1) {
        removeStore('token')
        this.props.history.push('/')
      }
    })
  }

  render() {
    const { key } = this.state
    return (
      <div className="top">
        <img className="logo" src={require('../images/home/logo.png')} />
        {/* <Tabs onChange={this.handleChange} activeKey={active}>
          <TabPane tab="实时呼叫" key="1" />
          <TabPane tab="账号管理" key="2" />
          <TabPane tab="事件记录" key="3" />
        </Tabs> */}
        <Menu
          onClick={this.handleClick}
          selectedKeys={[key]}
          onOpenChange={this.openChange}
          mode="horizontal"
          className="menu-tab"
        >
          <Menu.Item key="livecall">
            <span />
            <Link to="/livecall">实时呼叫</Link>
          </Menu.Item>
          <Menu.Item key="account">
            <Link to="/account">账号管理</Link>
          </Menu.Item>
          <Menu.Item key="eventRecord">
            <Link to="/eventRecord">事件记录</Link>
          </Menu.Item>
          <Menu.Item key="dataReport">
            <Link to="/dataReport">数据报表</Link>
          </Menu.Item>
          <Menu.Item key="equipmentCheck">
            <Link to="/equipmentCheck">基础检测</Link>
          </Menu.Item>
        </Menu>
        <div className="indicator">
          <div className="indi-item">
            <p>总事件</p>
            <p className="value">99</p>
          </div>
          <div className="indi-item">
            <p>待处理</p>
            <p className="value todo">99</p>
          </div>
          <div className="indi-item">
            <p>已处理</p>
            <p className="value">99</p>
          </div>
          <div className="indi-item">
            <p>在线云客服</p>
            <p className="value">99</p>
          </div>
        </div>
        <div className="right-info">
          <img
            src={require('../images/home/logo.png')}
            className="user-image"
          />
          <div>张三</div>
          <div className="login-out" onClick={this.logout}>
            退出
          </div>
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
