/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, message, Spin } from 'antd'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import '../../less/normal.less'
import './style.less'
import moment from 'moment'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import { getLocalStore, getUrl, getColor } from '~/utils/index'

const pageSize = 10

global.dhWeb = new DHAlarmWeb()
global.dhWeb.setWebsocketPort({ dataWsPort: 8088, mediaWsPort: 8088 })
global.cloudWebsocket
@hot
@withRouter
class Livecall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      searchContent: '',
      current: 1, // 当前页
      selected: 'all',
      total: 0,
      loading: true,
      // parkList: [], // 停车场位置
    }
    this.count = 0
    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'ID',
      },
      {
        title: '停车场',
        dataIndex: 'parkName',
        key: 'parkName',
      },
      {
        title: '出入场',
        dataIndex: 'inOutStr',
        key: 'inOutStr',
      },
      {
        title: '车牌号',
        dataIndex: 'carNum',
        key: 'carNum',
      },
      {
        title: '呼叫时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
      },
      {
        title: '等待时长',
        dataIndex: 'waitCountTime',
        key: 'waitCountTime',
        render: (text, record) => {
          const m1 = moment(record.createTimeStr)
          const m2 = moment()
          const duration = m2.diff(m1, 'seconds')
          return (
            <div
              id={`wait${record.id}${record.parkId}`}
              style={{ color: getColor(duration) }}
            >
              {duration}s
            </div>
          )
        },
      },
      {
        title: '事件处理',
        dataIndex: 'op',
        key: 'op', // 状态 1、未接听；2、等待接听；3、通话中、4、完成；5、挂断 6:未提交
        render: (text, record) => this.renderOp(record),
      },
    ]
  }

  componentDidMount() {
    const userInfo = JSON.parse(getLocalStore('userInfo'))
    // this.getList() // 列表数据
    this.timerGetList = window.setInterval(() => {
      this.getList() // 列表数据
    }, 10000)
    if (!global.cloudWebsocket) {
      this.audioLoginSuccess = false
      global.cloudWebsocket = new WebSocket(urlCng.taskDispatch + userInfo.id)

      // 连接成功建立的回调方法
      global.cloudWebsocket.onopen = event => {
        fetch({
          url: urlCng.callSoundAccount,
        }).then(res => {
          if (res.code === 1) {
            sessionStorage.setItem('serverAddr', res.result.url)
            this.loginResult = res.result

            global.dhWeb.login(
              res.result.username,
              res.result.password,
              res.result.url
            )
          }
        })
      }
      global.cloudWebsocket.onmessage = mess => {
        const msg = JSON.parse(mess.data)
        if (msg.method == 'task.reject.fail') {
          message.warning('暂无其他客服在线，请继续处理')
        } else {
          this.getList()
        }
      }
      global.dhWeb.onDeviceList = mess => {
        this.onDeviceList(mess)
      }

      // 语音设备登录
      global.dhWeb.onLogin = mess => {
        this.onLogin(mess)
      }

      // 语音消息通知
      global.dhWeb.onNotify = mess => {
        console.log(
          `onNotify-----------------------${JSON.stringify(
            mess
          )}--------------------`
        )
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
    }

    // 停车场下拉
    //  this.getParkPos()
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
    if (this.timerSendMessage) {
      window.clearInterval(this.timerSendMessage)
    }
    if (this.timerGetList) {
      window.clearInterval(this.timerGetList)
    }
    this.count = 0
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

  renderOp = record => {
    if (record.status === 6) {
      return (
        <div>
          <span className="not-operate" onClick={() => this.answer(record)}>
            未提交
          </span>
        </div>
      )
    }
    return (
      <div>
        {record.status === 3 ? (
          <span className="online" onClick={() => this.answer(record)}>
            通话中
          </span>
        ) : (
          <span className="online" onClick={() => this.online(record, 3)}>
            接听
          </span>
        )}
        {
          record.status !== 3 ? <span className="hang-up" onClick={() => this.hangUp(record, 5)}>挂断</span> : null
        }
        {record.status != 3 ? (
          <span className="not-operate" onClick={() => this.noOperate(record)}>
            暂不处理
          </span>
        ) : null}
        {record.status === 6 ? (
          <span className="not-operate" onClick={() => this.answer(record)}>
            未提交
          </span>
        ) : null}
      </div>
    )
  }

  onNotify = data => {
    const params = data.params
    params.createTime = global.cloudWebsocket.send(JSON.stringify(data))
  }

  onLogin = data => {
    const params = data.params
    if (data.error == 'success') {
      sessionStorage.setItem('loginHandle', params.loginHandle)
      this.timerSendMessage = window.setInterval(() => {
        global.cloudWebsocket.send(
          '{"method":"cloud.notify","params":{"heartlive":"I am here!"}}'
        )
      }, 10000)
      global.cloudWebsocket.send(JSON.stringify(data))
      this.count = 0
      this.audioLoginSuccess = true
      this.getList() // 列表数据
    } else {
      global.dhWeb.logout(params.loginHandle)
      this.count = this.count + 1
      message.warning('连接语音设备服务器失败，请刷新页面重试')
      window.location.reload()
      // if (this.loginResult && this.count <= 3) {
      //   global.dhWeb.login(
      //     this.loginResult.username,
      //     this.loginResult.password,
      //     this.loginResult.url
      //   )
      // }
    }
  }

  // 获取停车场位置
  // getParkPos = () => {
  //   fetch({
  //     url: urlCng.parkList,
  //   }).then(res => {
  //     if (res.code === 1) {
  //       if (res.result && res.result.data) {
  //         const resData = res.result.data
  //         resData.unshift({
  //           id: 'all',
  //           name: '全部',
  //         })
  //         setStore('parkList', resData)
  //         this.setState({
  //           parkList: resData,
  //         })
  //       }
  //     }
  //   })
  // }

  // 暂不处理
  noOperate = item => {
    // if (!this.audioLoginSuccess) {
    //   message.warning('正在连接语音设备，请稍后')
    // }
    const data = `{"callLogId":${item.id},"params":{},"method":"task.reject"}`
    global.cloudWebsocket.send(data)
    this.getList()
  }

  // 挂断
  hangUp = (item, status) => {
    if (!this.audioLoginSuccess) {
      window.location.reload()
      message.warning('正在和语音设备建立连接，请稍后')
      return
    }
    this.updateList(item, status)
    this.closeAll(item.audioDeviceId)
  }

  closeAll = audioDeviceId => {
    if (global.dhWeb) {
      global.dhWeb.directCloseRT(
        audioDeviceId,
        sessionStorage.getItem('loginHandle')
      )
    }
  }

  // 接听
  online = (item, status) => {
    const { data } = this.state
    this.flagOnline = false
    data.map(obj => {
      if (obj.status === 3 || obj.status === 6) {
        this.flagOnline = true
      }
    })
    if (this.flagOnline) {
      message.warning('有通话中或者未提交状态不能接听')
      return
    }
    if (!global.cloudWebsocket && obj.status != 6) {
      window.location.reload()
      message.warning('正在和语音设备建立连接，请稍后')

      return
    }
    this.updateList(item, status)
    this.answer(item)
  }

  // 更新
  updateList = (item, status) => {
    const m1 = moment(item.createTimeStr)
    const m2 = moment()
    const waitCountTime = m2.diff(m1, 'seconds')
    fetch({
      url: urlCng.callUpdate,
      method: 'POST',
      data: { id: item.id, status, waitCountTime },
    }).then(res => {
      if (res.code === 1) {
        this.getList()
      } else {
        message.error(res.msg)
      }
    })
  }

  componentDidUpdate = () => {
    // const { data } = this.state
    // if (!data.length) return
    // this.timer = window.setInterval(() => {
    //   for (let i = 0; i < data.length; i++) {
    //     const record = data[i]
    //     const m1 = moment(record.createTimeStr)
    //     const m2 = moment()
    //     const duration = m2.diff(m1, 'seconds')
    //     const $item = document.getElementById(
    //       `wait${record.id}${record.parkId}`
    //     )
    //     if (duration <= 60) {
    //       $item.style.color = '#3CEA43'
    //     } else if (duration >= 60 && duration <= 120) {
    //       $item.style.color = '#EAB43C'
    //     } else {
    //       $item.style.color = '#EA3C3C'
    //     }
    //     $item.innerHTML = `${m2.diff(m1, 'seconds')}s`
    //   }
    // }, 1000)
  }

  // 进入详情
  answer = item => {
    if (!this.audioLoginSuccess) {
      window.location.reload()
      message.warning('正在和语音设备建立连接，请稍后')
      return
    }
    this.props.history.push('/livedetail', { data: item })
  }

  getList = () => {
    const { current, searchContent, selected } = this.state // &userName=${searchContent}
    const params = {
      pageSize,
      curPage: current,
    }
    // 车牌号
    if (searchContent) {
      params.carNum = searchContent
    }
    // 停车场
    if (selected !== 'all') {
      params.parkId = selected
    }
    const url = getUrl(params, `${urlCng.callWaitList}`)

    fetch({
      url,
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result.data,
          total: res.result.page.totalNum,
          loading: false,
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  // 分页
  handlePageChange = pageNumber => {
    this.setState(
      {
        current: pageNumber,
      },
      () => {
        this.getList()
      }
    )
  }

  // 下拉改变
  dropChange = (e, key) => {
    this.setState({
      [key]: e,
    })
  }

  // 搜索框改变
  changeValue = e => {
    this.setState({
      searchContent: e.target.value,
    })
  }

  // 筛选
  filter = () => {
    this.setState({ current: 1 }, () => {
      this.getList()
    })
  }

  //   parkList, selected,  searchContent,
  render() {
    const { data, current, total, loading } = this.state
    return (
      <div className="panel">
        <div id="liveCall">
          <div className="search-wrap" />
          {/* 表格数据 */}
          {
            !loading ?
              <Table
                dataSource={data}
                columns={this.headers}
                rowKey={(record, index) => index}
                loading={loading}
                locale={{ emptyText: '暂无数据' }}
                pagination={{
                  total,
                  pageSize,
                  current,
                  onChange: this.handlePageChange,
                }}
              /> : <Spin />
          }
          <div className="total">
            共{total}条记录 <span className="page-num">每页{pageSize}条</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Livecall
