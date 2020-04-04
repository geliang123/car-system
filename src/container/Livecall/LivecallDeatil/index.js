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

let hour = 0
let minute = 0
let second = 0 // 时 分 秒
let millisecond = 0 // 毫秒
let allSecond = 0
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
    this.countTimer = setInterval(this.countItem, 50)
    if (callDetailId) {
      this.getDetail(callDetailId)
      // this.deviceId = location.state.data.audioDeviceId
      // this.playVideo(962025, 912043, true)

      // this.timer = setTimeout(() => {
      //   global.dhWeb.startTalk(this.deviceId)
      // }, 3000)
    }
    // this.videoView = new mainClass()
    // this.videoView.devicetype = '1'
    // const loginJsonMap = {
    //   szIPAddr: '192.168.1.14',
    //   dwPort: '80',
    //   szUserName: 'admin',
    //   szPassword: '123456',
    //   dwLoginProto: 0
    // }
    // const loginJsonstring = JSON.stringify(loginJsonMap)
    // this.videoView.login(loginJsonstring)
    // this.videoView.getChannellist()
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
    if (this.countTimer) clearInterval(this.countTimer)
    hour = 0
    minute = 0
    millisecond = 0
    allSecond = 0
    second0
  }

  countItem = () => {
    // 计时
    millisecond += 50
    allSecond += 50
    if (millisecond >= 1000) {
      millisecond = 0
      second += 1
    }
    if (second >= 60) {
      second = 0
      minute += 1
    }

    if (minute >= 60) {
      minute = 0
      hour += 1
    }
    document.getElementById(
      'timetext'
    ).innerHTML = `${hour}时${minute}分${second}秒`
    document.getElementById('allSecond').innerHTML = allSecond
  }

  playVideo = (videoDeviceId, audioDeviceId, isTalk) => {
    closeAll()
    const html =
      `${'<div class="videoboxDiv" ondblclick="launchFullscreen(this)">' +
        '<video id="play_'}${912043}" width="327" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>${$(
        `#device_${audioDeviceId}`
      ).text()}</span>` +
      '<img class="loading" src="./image/loading.gif"/>' +
      '</div>'
    $('.videoDiv').append(html)
    global.dhWeb.playDeviceAudio(912043)
    $('.selectVideo')
      .parent()
      .css('zIndex', '2')
    const video = document.getElementById(`play_${912043}`)
    global.dhWeb.playRT(
      video,
      912043,
      sessionStorage.getItem('loginHandle'),
      isTalk
    )
    if (isTalk) {
      if ($('#talk').hasClass('talking')) return
      $('#talk').addClass('talking')
      $('.talking').css('background', '#aaa')
      // 播放联动
      const parentId = $(`#device_${audioDeviceId}`).attr('parentId')
      const groupDevices = $(`li[parentId = ${parentId}]`)
      global.dhWeb.playRT(
        $('#play_962065')[0],
        962025,
        sessionStorage.getItem('loginHandle'),
        false
      )
    }
  }

  closeAll = () => {
    if (global.dhWeb) {
      global.dhWeb.stopRT(this.deviceId, sessionStorage.getItem('loginHandle'))
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

  close = () => {
    if (this.videoView) {
      this.closeAll()
      this.videoView.stopVideo()
    }
  }

  // 更新
  updateList = (item, status) => {
    if (this.countTimer) clearInterval(this.countTimer)
    this.close()
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

  muted = () => {}

  render() {
    const { data } = this.state

    return (
      <div className="panel">
        <div id="LiveCallDeatail">
          <Title title="事件处理" />
          <div className="wrap-content">
            {/* 右边内容 */}
            <div className="left">
              <div className="left-item">
                <div className="title">
                  {data.inOut === 2 ? '入场' : '出场'}车辆监控
                </div>
                <div
                  className={`ocxStyle ${data.inOut == 2 ? 'block' : 'none'}`}
                >
                  <div id="playerContainer" />
                </div>
              </div>
              <div className="left-item">
                <div className="title">
                  {data.inOut === 2 ? '入场' : '出场'}车辆监控
                </div>
                <div className="videoDiv" />
              </div>
              <div className="bottom-calling">
                <span className="text">
                  {data.status === 3 ? (
                    <span>
                      通话中:
                      <span id="timetext" />
                    </span>
                  ) : (
                    '通话结束'
                  )}
                </span>
                <span id="allSecond" style={{ display: 'none' }} />
                <div className="calling-right">
                  {data.status === 5 ? (
                    <div className="icon-wrap hujiao">
                      <span className="icon hujiao" />
                      <span onClick={() => this.updateList(data, 3)}>呼叫</span>
                    </div>
                  ) : null}
                  {data.status === 3 ? (
                    <div className="icon-wrap" onClick={this.muted}>
                      <span className="icon jingyin" />
                      <span>静音</span>
                    </div>
                  ) : null}
                  {data.status === 3 ? (
                    <div
                      className="icon-wrap"
                      onClick={() => this.updateList(data, 5)}
                    >
                      <span className="icon guaduan" />
                      <span>挂断</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* 左边内容 */}
            <RightComponent
              data={data}
              close={this.close}
              goback={this.goback}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LivecallDeatil
