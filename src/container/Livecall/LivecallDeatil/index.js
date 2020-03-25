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

global.dhWeb = new DHAlarmWeb()
global.dhWeb.setWebsocketPort({ dataWsPort: 8088, mediaWsPort: 8088 })
console.log(global.dhWeb)
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

      global.dhWeb.login('test001', '123456', '212.129.140.31')
      global.dhWeb.onDeviceList = mess => {
        this.onDeviceList(mess)
      }
      global.dhWeb.onLogin = mess => {
        this.onLogin(mess)
      }
      global.dhWeb.onNotify = mess => {
        this.onNotify(mess)
      }
      global.dhWeb.onParseMsgError = mess => {
        if (mess.error.indexOf('alarmServer offline') != -1) {
          alert('报警服务器不在线')
        }
      }
      global.dhWeb.onAlarmServerClosed = mess => {
        $('#logout').click()
      }
      global.dhWeb.onPlayRT = data => {
        if (data.error != 'success') {
          $('#closeAll').click()
        }
      }
      global.dhWeb.onDeviceMove = data => {
        const deviceList = data.params.list
        for (const i in deviceList) {
          const parentId = deviceList[i].parentId
          const deviceId = deviceList[i].deviceId
          $(`#device_${deviceId}`).attr('parentId', parentId)
        }
      }
    }
  }

  componentWillUnmount() {
    if (global.dhWeb) {
      global.dhWeb = null
    }
  }

  onDeviceList = data => {
    const deviceList = data.params.list
    let className
    for (const i in deviceList) {
      if (deviceList[i].deviceType == 'Alarm') {
        if (deviceList[i].action == 'Offline') {
          className = 'alarm_Offline'
        } else {
          className = 'alarm_Online'
        }
      } else if (deviceList[i].action == 'Offline') {
        className = 'linkage_Offline'
      } else {
        className = 'linkage_Online'
      }
      if ($(`#device_${deviceList[i].deviceId}`)[0]) return
      const deviceHtml = `<li class='${className}' ondblclick='dbClickDevice(this)' id='device_${deviceList[i].deviceId}' parentId=${deviceList[i].parentId}>${deviceList[i].deviceName}</li>`
      $('.device').append(deviceHtml)
    }
  }

  onLogin = data => {
    const params = data.params
    if (data.error == 'success') {
      sessionStorage.setItem('loginHandle', params.loginHandle)
      $('.loginDiv').hide()
      $('.deviceDiv').show()
      $('.showNameDiv p').text(`用户名：${$('#uname').val()}`)
    } else {
      alert('登录失败')
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
              <div className="left-item">
                <div className="img-watch">
                  <span>入场车辆监控</span>
                  <span>{data.inTimeStr}</span>
                </div>
                {this.getShow()}
              </div>
              <div className="left-item">
                <div className="img-watch">
                  <span>出场车辆监控</span>
                  <span>{data.outTimeStr}</span>
                </div>
                {this.getShow()}
              </div>
              <div className="left-item">
                <div className="img-watch">
                  <span>入场车道监控</span>
                  <span>{data.inTimeStr}</span>
                </div>
                {this.getShow()}
              </div>
              <div className="left-item">
                <div className="img-watch">
                  <span>出场车道监控</span>
                  <span>{data.outTimeStr}</span>
                </div>
                {this.getShow()}
              </div>
              <div className="bottom-calling">
                <span className="text">
                  {data.status === 3 ? '通话中 10:33' : '通话结束'}
                </span>
                <div className="calling-right">
                  {data.status === 5 ? (
                    <div className="icon-wrap hujiao">
                      <span className="icon hujiao" />
                      <span onClick={() => this.updateList(data, 3)}>呼叫</span>
                    </div>
                  ) : null}
                  {data.status === 3 ? (
                    <div className="icon-wrap">
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
            <RightComponent data={data} />
          </div>
        </div>
      </div>
    )
  }
}

export default LivecallDeatil
