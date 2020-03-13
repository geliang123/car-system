import React, { Component } from 'react'
import { Tabs } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../../less/normal.less'
import './style.less'

const { TabPane } = Tabs
@hot
class Livecall extends Component {
  componentDidMount() {}

  render() {
    return <div id="liveCall">111</div>
  }
}

export default Livecall
