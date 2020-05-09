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
    const { equipmentIp, equipmentPort } = this.props.data
    if (equipmentIp && equipmentPort && !this.videoView) {
      this.initVideo(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { equipmentIp, equipmentPort } = nextProps.data
    if (equipmentIp && equipmentPort && !this.videoView) {
      this.initVideo(nextProps)
    }
  }

  componentWillUnmount() {
    if (this.videoView) {
      const rst = this.videoView.fasterlogout()
      if (rst.code !== 1) {
        message.warning(rst.msg)
      }
    }
  }

  initVideo = props => {
    const { equipmentIp, equipmentPort } = props.data
    // try {
    //   this.videoView = new mainClass()
    //   const rst = this.videoView.fasterLogin(
    //     equipmentIp,
    //     equipmentPort,
    //     'admin',
    //     '123456'
    //   )
    //   if (rst.code !== 1) {
    //     message.warning(rst.msg)
    //   }
    // } catch (e) {
    //   message.error('监控初始化失败')
    // }
  }

  render() {
    return (
      <iframe src='//47.106.164.38/plugins/video/video.html' height='100%' width='100%'></iframe>
    )
  }
}

export default VideoComponent
