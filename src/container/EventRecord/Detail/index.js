import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import Title from '~/component/Title'
import '../../../less/normal.less'
import './style.less'
import urlCng from '~/config/url'
import { getStore, setStore } from '~/utils'
import fetch from '~/utils/fetch'

@hot
@withRouter
class Detail extends Component {
  state = {
    data: {},
  }

  componentDidMount() {
    const { location } = this.props
    const eventRecordDetailId =
      (location && location.state.data && location.state.data.id) ||
      getStore('eventRecordDetailId')
    setStore('eventRecordDetailId', eventRecordDetailId)
    if (eventRecordDetailId) {
      this.getDetail(eventRecordDetailId)
    }
  }

  getDetail = id => {
    const url = `${urlCng.callDetail}?id=${id}`
    fetch({
      url,
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result,
        })
      }
    })
  }

  getStr = str => {
    if (!str) return '--'
    return str
  }

  render() {
    const { data } = this.state
    return (
      <div className="panel">
        <div id="eventRecordDetail">
          <Title title="事件详情" />
          <div className="info-wrap">
            <div className="detail-content">
              <p>车辆信息</p>
              <div className="row-content">
                <span>停 车 场：</span>
                <span>{this.getStr(data.parkName)}</span>
              </div>
              <div className="row-content">
                <span>车 牌 号：</span>
                <span>{this.getStr(data.carNum)}</span>
              </div>
              <div className="row-content">
                <span>出场时间：</span>
                <span>{this.getStr(data.modifyTimeStr)}</span>
              </div>
              <div className="row-content">
                <span>入场时间：</span>
                <span>{this.getStr(data.inTimeStr)}</span>
              </div>
              <div className="row-content">
                <span>支付费用：</span>
                <span>{this.getStr(data.payAmount)}</span>
              </div>
              <div className="row-content">
                <span>处理方式：</span>
                <span>{this.getStr(data.operatedTypeStr)}</span>
              </div>
              <div className="row-content">
                <span>问题类型：</span>
                <span>{data.problemIdStr || '--'}</span>
              </div>
              <div className="row-content">
                <span>备注信息：</span>
                <span className="remark">{this.getStr(data.remark)}</span>
              </div>
              <div className="row-content">
                <span>处理人：</span>
                <span>{this.getStr(data.userName)}</span>
              </div>
            </div>
            <div className="detail-img">
              <div className="img-title">入场照片</div>
              {data.inout !== 1 ? (
                <img src={data.carImgUrl} width="100%" height="194px" />
              ) : (
                <img />
              )}
              <div className="img-title out">出场照片</div>
              {data.inout === 1 ? (
                <img src={data.carImgUrl} width="100%" height="194px" />
              ) : (
                <img />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
