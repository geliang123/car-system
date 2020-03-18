import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import Title from '~/component/Title'
import '../../../less/normal.less'
import './style.less'

@hot
class Detail extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="panel">
        <div id="eventRecordDetail">
          <Title title="事件详情" />
          <div className="info-wrap">
            <div className="detail-content">
              <p>入场信息</p>
              <div className="row-content">
                <span>时间：</span>
                <span>2020-03-01 17:30</span>
              </div>
              <div className="row-content">
                <span>地点：</span>
                <span>红星大厦停车场</span>
              </div>
              <div className="row-content">
                <span>车牌：</span>
                <span>沪A12345</span>
              </div>
              <div className="row-content">
                <span>支付费用：</span>
                <span>— —</span>
              </div>
              <p className="img-title">车辆图片</p>
              <img
                src={require('../../../images/bg.png')}
                width="100%"
                height="194px"
              />
              <div className="row-content">
                <span>处理方式:</span>
                <span>远程开闸</span>
              </div>
              <div className="row-content">
                <span>备注：</span>
                <span>支付不开闸</span>
              </div>
              <div className="row-content">
                <span>处理人：</span>
                <span>张三(管理员)</span>
              </div>
            </div>
            <div className="detail-content">
              <p>出场信息</p>
              <div className="row-content">
                <span>时间：</span>
                <span>2020-03-01 17:30</span>
              </div>
              <div className="row-content">
                <span>地点：</span>
                <span>红星大厦停车场</span>
              </div>
              <div className="row-content">
                <span>车牌：</span>
                <span>沪A12345</span>
              </div>
              <div className="row-content">
                <span>支付费用：</span>
                <span>— —</span>
              </div>
              <p className="img-title">车辆图片</p>
              <img
                src={require('../../../images/bg.png')}
                width="100%"
                height="194px"
              />
              <div className="row-content">
                <span>处理方式:</span>
                <span>远程开闸</span>
              </div>
              <div className="row-content">
                <span>备注：</span>
                <span>支付不开闸</span>
              </div>
              <div className="row-content">
                <span>处理人：</span>
                <span>张三(管理员)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
