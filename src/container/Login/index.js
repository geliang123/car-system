import React, { Component } from 'react'
import { Icon, Input, Button, message } from 'antd'
import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { setLocalStore } from '~/utils/index'
import fetch from '~/utils/fetch'
import '../../less/normal.less'
import './style.less'
import urlCng from '~/config/url'
import md5 from 'md5'

@hot
@withRouter
class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  componentDidMount() {}

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
  }

  login = () => {
    const { username, password } = this.state
    if (!username) {
      message.error('请填写用户名')
      return
    }
    if (!password) {
      message.error('请填写密码')
      return
    }
    fetch({
      url: urlCng.login,
      method: 'POST',
      data: {
        username,
        password // : md5(password)
      }
    }).then(res => {
      if (res.code === 1) {
        setLocalStore('token', res.result.token)
        setLocalStore('userInfo', res.result.user)
        this.props.history.push('/call')
      } else {
        message.error(res.msg)
      }
    })
  }

  render() {
    const { username, password } = this.state
    return (
      <div className="login-bg" id="Login">
        <div className="login-box">
          <div className="title">云坐席后台管理系统</div>
          <Input
            className="username"
            placeholder="账号"
            value={username}
            onChange={e => this.changeValue(e, 'username')}
            prefix={<Icon type="user" style={{ color: '#333333' }} />}
          />

          <Input
            className="password"
            placeholder="密码"
            value={password}
            onChange={e => this.changeValue(e, 'password')}
            prefix={<Icon type="lock" style={{ color: '#333333' }} />}
            type="password"
          />
          <Button className="login-btn" onClick={this.login}>
            登录
          </Button>
        </div>
      </div>
    )
  }
}

export default Login
