import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'

import '../../../less/normal.less'
import './style.less'
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
        location.state.data.parkId) ||
      getStore('callDetailId')
    setStore('callDetailId', callDetailId)
    if (callDetailId) {
      this.getDetail(callDetailId)
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

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
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
                <div className="img-watch">入场车辆监控</div>
                <img src={require('../../../images/bg.png')} width="100%" />
              </div>
              <div className="left-item">
                <div className="img-watch">出场车辆监控</div>
                <img src={require('../../../images/bg.png')} width="100%" />
              </div>
              <div className="left-item">
                <div className="img-watch">入场车道监控</div>
                <img src={require('../../../images/bg.png')} width="100%" />
              </div>
              <div className="left-item">
                <div className="img-watch">出场车道监控</div>
                <img src={require('../../../images/bg.png')} width="100%" />
              </div>
              <div className="bottom-calling">
                <span className="text">通话中 10:33</span>
                <div className="calling-right">
                  <div className="icon-wrap">
                    <span className="icon jingyin" />
                    <span>静音</span>
                  </div>
                  <div className="icon-wrap">
                    <span className="icon guaduan" />
                    <span>挂断</span>
                  </div>
                  <div className="icon-wrap hujiao">
                    <span className="icon hujiao" />
                    <span>呼叫</span>
                  </div>
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
