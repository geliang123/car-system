/* eslint-disable new-cap */
/* eslint-disable no-undef */

import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import '../../../less/normal.less'
import './style.less'
import { message } from 'antd'

@hot
class VideoComponent extends Component {
  componentDidMount() {
  }

  render() {
    const { equipmentIp, equipmentPort, equipmentUsername, equipmentPassword } = this.props.equipData;
    let src = '//47.106.164.38/plugins/video/video.html?temp=1&ip='+equipmentIp+'&port='+equipmentPort+'&username='+equipmentUsername+'&password='+equipmentPassword
    return (
      <iframe name="unviewFrame" src={src} height='100%' width='100%'></iframe>
    )
  }
}

export default VideoComponent
