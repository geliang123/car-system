import React, { Component } from 'react'
import { Button } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import '../../less/antd.less'
import './style.less'

@hot
class DataReport extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="panel" id="EquipmentCheck">
        <div className="client-check">
          <div className="title">客服端检测</div>
          <Button className="check">检测</Button>
        </div>
        <div className="fundation-check">
          <div className="title">基础设施层检测</div>
          <Button className="check">检测</Button>
        </div>
      </div>
    )
  }
}

export default DataReport
