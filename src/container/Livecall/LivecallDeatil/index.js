/* eslint-disable new-cap */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'

import '../../../less/normal.less'
import './style.less'
import { message } from 'antd'
import Title from '~/component/Title'
import urlCng from '~/config/url'
import { getStore, setStore } from '~/utils'
import fetch from '~/utils/fetch'
import RightComponent from './RightComponent'

@hot
class LivecallDeatil extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    const { location } = this.props
    const callDetailId =
      (location &&
        location.state &&
        location.state.data &&
        location.state.data.id) ||
      getStore('callDetailId')
    setStore('callDetailId', callDetailId)
    if (callDetailId) {
      this.getDetail(callDetailId)
    }
    this.videoView = new mainClass()
    this.videoView.devicetype = '1'
    const loginJsonMap = {
      szIPAddr: '192.168.0.104',
      dwPort: '80',
      szUserName: 'admin',
      szPassword: '123456',
      dwLoginProto: 0
    }
    const loginJsonstring = JSON.stringify(loginJsonMap)
    this.videoView.login(loginJsonstring)
    this.videoView.getChannellist()
  }

  componentWillUnmount() {
    if (global.dhWeb) {
      global.dhWeb = null
    }
  }

  goback = () => {
    this.props.history.goBack()
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e
    })
  }

  getDetail = id => {
    const url = `${urlCng.callDetail}?id=${id}`
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result
        })
      }
    })
  }

  // 更新
  updateList = (item, status) => {
    fetch({
      url: urlCng.callUpdate,
      method: 'POST',
      data: { id: item.id, status }
    }).then(res => {
      if (res.code === 1) {
        message.success('操作成功')
        this.setState({
          data: res.result
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
  }

  getShow = () => {
    const { data } = this.state
    if (!data.carImgUrl) {
      return <div className="car-img videoDiv" />
    }
    return (
      <div className="no-img">
        <img src={require('../../../images/home/no-img.png')} />
      </div>
    )
  }

  render() {
    const { data } = this.state

    return (
      <div className="panel">
        <div id="LiveCallDeatail">
          <Title title="事件处理" />
          <div className="wrap-content">
            {/* 右边内容 */}
            <div className="left">
              <div className="ocxStyle">
                <div id="playerContainer" />
              </div>
            </div>
            {/* 左边内容 */}
            <RightComponent data={data} />
          </div>
        </div>
      </div>
    )
  }
}

export default LivecallDeatil
