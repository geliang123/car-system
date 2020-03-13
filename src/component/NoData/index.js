import React, { Component } from 'react'
import './index.less'

class NoData extends Component {
  state = {}

  render() {
    return (
      <div className="noneData">
        {/* <img src={require('../../images/common/no-images.png')} /> */}
        <p>暂无比赛数据</p>
      </div>
    )
  }
}

export default NoData
