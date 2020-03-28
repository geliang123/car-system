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
