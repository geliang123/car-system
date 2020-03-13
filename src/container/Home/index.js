import React, { Component } from 'react'
import { Tabs } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import './style.less'
import Account from './Account'
import EventRecord from './EventRecord'

const { TabPane } = Tabs
@hot
class Home extends Component {
  state = {
    tab: '3'
  }

  componentDidMount() {}

  // tab切换
  handleChange = key => {
    this.setState({
      tab: key
    })
  }


  render() {
    const { tab } = this.state
    return (
      <div id="homeCar">
        <div className="content">{this.getComponent(tab)}</div>
      </div>
    )
  }
}

export default Home
