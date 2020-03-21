import React, { Component } from 'react'
import { Button, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import '../../less/antd.less'
import './style.less'

@hot
class DataReport extends Component {
  componentDidMount() {}

  checkClient = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        () => {
          message.success('客户端正常')
        },
        () => {
          message.error('客户端异常')
        }
      )
    } else {
      message.error('客户端异常')
    }
  }

  render() {
    return (
      <div className="panel" id="ReportCheck">
        <div className="client-check">
          <div className="title">客户端检测</div>
          <Button className="check" onClick={this.checkClient}>
            检测
          </Button>
        </div>
        <div className="fundation-check">
          <div className="title">基础设施层检测</div>
          <Button className="check">检测</Button>
        </div>
        <div id="video" style={{ display: 'none' }} />
      </div>
    )
  }
}

export default DataReport
