/* eslint-disable no-empty */
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
import moment from 'moment'
import urlCng from '~/config/url'
import { getStore, setStore } from '~/utils'
import fetch from '~/utils/fetch'
import RightComponent from './RightComponent'
import eventObject from '~/config/eventSignal'
import VideoComponent from './VideoComponent'

@hot
class LivecallDeatil extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      // loading: true,
    }
    this.hour = 0
    this.minute = 0
    this.second = 0 // 时 分 秒
    this.millisecond = 0 // 毫秒
    this.allSecond = 0

    // video 设备
    this.equipmentIp = ''
    this.equipmentPort = ''
  }

  componentDidMount() {
    const { location } = this.props
    const callDetailData = location && location.state && location.state.data
    const callDetailId =
      (callDetailData && callDetailData.id) || getStore('callDetailId')
    setStore('callDetailId', callDetailId)
    if (callDetailData && callDetailId) {
      this.getDetail(callDetailId)
      if (callDetailData.status !== 6) {
        // 未提交状态不需要通话
        this.deviceId = location.state.data.audioDeviceId
        this.playVideo(
          location.state.data.videoDeviceId,
          location.state.data.audioDeviceId,
          true
        )
        global.dhWeb.startTalk(this.deviceId)
        this.equipmentIp = location.state.data.equipmentIp
        this.equipmentPort = location.state.data.equipmentPort
        // try {
        //   this.videoView = new mainClass()
        //   const rst = this.videoView.fasterLogin(
        //     location.state.data.equipmentIp,
        //     location.state.data.equipmentPort,
        //     'admin',
        //     '123456'
        //   )
        //   if (rst.code !== 1) {
        //     message.warning(rst.msg)
        //   }
        // } catch (e) {
        //   message.error('监控初始化失败')
        // }
        // eslint-disable-next-line no-new
        // new Promise(() => {
        //   // 做一些异步操作
        //   this.videoTimer = setTimeout(() => {
        //   }, 8000)
        // })
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
    if (this.countTimer) clearInterval(this.countTimer)
    if (this.videoTimer) clearTimeout(this.videoTimer)
    this.hour = 0
    this.minute = 0
    this.second = 0 // 时 分 秒
    this.millisecond = 0 // 毫秒
    this.allSecond = 0
    this.closeAll()
    if (this.videoView) {
      const rst = this.videoView.fasterlogout()
      if (rst.code !== 1) {
        message.warning(rst.msg)
      }
    }
  }

  countItem = () => {
    // 计时
    this.millisecond += 50
    if (this.millisecond >= 1000) {
      this.millisecond = 0
      this.second += 1
      this.allSecond += 1
    }
    if (this.second >= 60) {
      this.second = 0
      this.minute += 1
    }

    if (this.minute >= 60) {
      this.minute = 0
      this.hour += 1
    }
    if (document.getElementById('timetext')) {
      if (this.allSecond < 0) {
        document.getElementById(
          'timetext'
        ).innerHTML = '0秒'
        document.getElementById('allSecond').innerHTML = 0
      } else {
        document.getElementById(
          'timetext'
        ).innerHTML = `${this.hour}时${this.minute}分${this.second}秒`
        document.getElementById('allSecond').innerHTML = this.allSecond
      }
    }
  }

  playVideo = (videoDeviceId, audioDeviceId, isTalk) => {
    closeAll()
    const html =
      `${
        '<div class="videoboxDiv" ondblclick="launchFullscreen(this)">' +
        '<video id="play_'
      }${audioDeviceId}" width="365" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>${$(
        `#device_${audioDeviceId}`
      ).text()}</span>` + '</div>'
    $('.videoDiv').append(html)
    global.dhWeb.playDeviceAudio(audioDeviceId)
    $('.selectVideo').parent().css('zIndex', '2')
    const video = document.getElementById(`play_${audioDeviceId}`)
    global.dhWeb.playRT(
      video,
      audioDeviceId,
      sessionStorage.getItem('loginHandle'),
      isTalk
    )
    if (isTalk) {
      if ($('#talk').hasClass('talking')) return
      $('#talk').addClass('talking')
      $('.talking').css('background', '#aaa')
      // 播放联动

      global.dhWeb.playRT(
        $(`#play_${videoDeviceId}`)[0],
        videoDeviceId,
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
    setTimeout(() => {
      window.location.reload()
    }, 50)
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e,
    })
  }

  getDetail = id => {
    const url = `${urlCng.callDetail}?id=${id}`
    fetch({
      url,
    }).then(res => {
      if (res.code === 1) {
        this.setState(
          {
            data: res.result,
          },
          () => {
            if (res.result.status === 3) {
              // 初始化 通话时间
              const m1 = moment(res.result.modifyTimeStr)
              const m2 = moment()
              this.second = m2.diff(m1, 'seconds')
              this.hour = m2.diff(m1, 'hour')
              this.minute = m2.diff(m1, 'minute')
              this.allSecond = m2.diff(m1, 'seconds')
              // 计时器 通话中时间计时
              this.countTimer = setInterval(this.countItem, 50)
            }
            if (res.result.status === 6) {
              const x = res.result.operatedSum
              const tempTime = moment.duration(parseInt(x * 1000))
              if (document.getElementById('timetext')) {
                if (this.allSecond < 0) {
                  document.getElementById(
                    'timetext'
                  ).innerHTML = '0秒'
                  document.getElementById('allSecond').innerHTML = 0
                } else {
                  document.getElementById(
                    'timetext'
                  ).innerHTML = `${tempTime.hours()}时${tempTime.minutes()}分${tempTime.seconds()}秒`
                  document.getElementById('allSecond').innerHTML =
                    res.result.operatedSum
                }
              }
            }
          }
        )
      }
    })
  }

  close = () => {
    if (global.dhWeb) {
      this.closeAll()
    }
  }

  // 更新
  updateList = (item, status) => {
    const { data } = this.state
    if (this.countTimer) clearInterval(this.countTimer)
    this.close()
    fetch({
      url: urlCng.callUpdate,
      method: 'POST',
      data: {
        id: item.id,
        status,
        operatedSum: this.allSecond,
      },
    }).then(res => {
      if (res.code === 1) {
        message.success('操作成功')
        if (status === 6) {
          eventObject.clearSetInternal.dispatch()
        }
        this.setState({
          data: Object.assign({}, data, { status }),
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value,
    })
  }

  getShow = () => (
    <div className="no-img">
      <img src={require('../../../images/home/no-img.png')} />
    </div>
  )

  muted = () => {}

  call = (data, status) => {
    this.playVideo(962025, 912043, true)
    this.updateList(data, status)
  }

  render() {
    // loading
    const { data } = this.state
    const equipData = {
      equipmentIp: this.equipmentIp,
      equipmentPort: this.equipmentPort
    }
    return (
      <div className="panel">
        <div id="LiveCallDeatail">
          {/* <Title title="事件处理" /> */}
          <div className="wrap-content">
            {/* 右边内容 ${!loading ? 'show' : 'hide'} */}
            <div className="left">
              <div className="left-item">
                <div className="title">
                  {data.inOut === 2 ? '入场' : '出场'}车辆监控
                </div>
                <VideoComponent data={equipData} />
              </div>
              <div className="left-item">
                <div className="title">
                  {data.inOut === 2 ? '入场' : '出场'}车道监控
                </div>
                <div className="videoDiv" />
                {/* {loading ? <Spin /> : null} */}
              </div>
              <div className="left-item">
                <div className="title">
                  {data.inOut !== 2 ? '入场' : '出场'}车辆监控
                </div>
                {this.getShow()}
              </div>
              <div className="left-item">
                <div className="title">
                  {data.inOut !== 2 ? '入场' : '出场'}车辆监控
                </div>
                {this.getShow()}
              </div>
              <div className="bottom-calling">
                <span className="text">
                  {data.status === 3 ? <span>通话中:</span> : '通话结束:'}
                  <span id="timetext" />
                </span>
                <span id="allSecond" style={{ display: 'none' }} />
                <div className="calling-right">
                  {data.status === 5 ? (
                    <div className="icon-wrap hujiao">
                      <span className="icon hujiao" />
                      <span onClick={() => this.call(data, 3)}>呼叫</span>
                    </div>
                  ) : null}
                  {/* {data.status === 3 ? (
                    <div
                      className="icon-wrap"
                      onClick={() => this.call(data, 3)}
                    >
                      <span className="icon jingyin" />
                      <span>静音</span>
                    </div>
                  ) : null} */}
                  {data.status === 3 ? (
                    <div
                      className="icon-wrap"
                      onClick={() => this.updateList(data, 6)}
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
