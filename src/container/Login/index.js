import React, { Component } from 'react'
import { Icon, Input, Button } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import './style.less'

@hot
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
          <Button className="login-btn">登录</Button>
        </div>
      </div>
    )
  }
}

export default Login
