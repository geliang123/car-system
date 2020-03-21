import React, { Component } from 'react'
import { Menu, Modal } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import fetch from '~/utils/fetch'
import { removeStore, getLocalStore } from '~/utils/index'
import CheckComponent from './CheckComponent'
import urlCng from '~/config/url'
import './style.less'

@withRouter
class NavTop extends Component {
  state = {
    key: 'call',
    indicator: {},
    menuData: [],
    visible: false
  }

  componentDidMount() {
    this.getMenu()
    this.getTopData()
  }

  getTopData = () => {
    fetch({
      url: urlCng.logData
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          indicator: res.result
        })
      }
    })
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
        this.props.history.push('/')
        removeStore('token')
      }
    })
  }

  // 获取菜单数据
  getMenu = () => {
    fetch({
      url: urlCng.menu,
      method: 'POST'
    }).then(res => {
      if (!res.code) {
        this.setState({
          menuData: res || []
        })
      }
    })
  }

  check = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { key, indicator, menuData, visible } = this.state
    const user = JSON.parse(getLocalStore('userInfo'))
    if (!Object.keys(user).length) return null
    return (
      <div className="top" id="TopContainer">
        <img className="logo" src={require('../../images/home/logo.png')} />
        <Menu
          onClick={this.handleClick}
          selectedKeys={[key]}
          onOpenChange={this.openChange}
          mode="horizontal"
          className="menu-tab"
        >
          {menuData.map(item => (
            <Menu.Item key={item.code.toLowerCase()}>
              <span />
              <Link to={`/${item.code.toLowerCase()}`}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <div className="indicator">
          <div className="indi-item">
            <p>总事件</p>
            <p className="value">{indicator.sumCalls}</p>
          </div>
          <div className="indi-item">
            <p>待处理</p>
            <p className="value todo">{indicator.waitCalls}</p>
          </div>
          <div className="indi-item">
            <p>已处理</p>
            <p className="value">{indicator.edCalls}</p>
          </div>
          <div className="indi-item">
            <p>在线云客服</p>
            <p className="value">{indicator.onLines}</p>
          </div>
        </div>
        <div className="right-info">
          {/* <img
            src={require('../images/home/logo.png')}
            className="user-image"
          /> */}
          <div>{user.userName}</div>
          <div className="login-out" onClick={this.logout}>
            退出
          </div>
          <div className="status">
            <span className="circle sleep" />
            休息
          </div>
          <div className="tri" />
          <div className="settings" />
          <div className="jiance" onClick={this.check} />
        </div>
        {/* 弹框 */}
        <Modal
          title="客服端检测"
          visible={visible}
          className="watch-image-dialog"
          okText="确认"
          cancelText=""
          onCancel={this.handleCancel}
          width={457}
          destroyOnClose
          confirmLoading={false}
        >
          <CheckComponent />
        </Modal>
      </div>
    )
  }
}

export default NavTop
