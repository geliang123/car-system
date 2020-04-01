import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import '../../../less/normal.less'
import './panle.less'
import { Collapse, Button } from 'antd'

const { Panel } = Collapse

@hot
class CarNumber extends Component {
  renderHeader = () => (
    <div className="header-info">
      <span>111</span>
      <span>展开详情</span>
    </div>
  )

  getContent = () => (
    <div className="detail-content">
      <div className="left">
        <div className="item">
          <p className="name">车牌号</p>
          <p className="value">沪A123456</p>
        </div>
        <div className="item">
          <p className="name">停车场</p>
          <p className="value">红星大厦停车场</p>
        </div>
        <div className="item">
          <p className="name">缴费情况</p>
          <p className="vaule">已缴</p>
        </div>
        <div className="item">
          <p className="name">金额</p>
          <p className="value">¥300</p>
        </div>
        <Button className="btn" onClick={this.submit}>
          提交
        </Button>
      </div>
      <div className="right">
        <div className="wrap-top">
          <div className="item">
            <p className="name">出场时间</p>
            <p className="value">2020/03/03 20:32</p>
          </div>
          <div className="item">
            <p className="name">入场时间</p>
            <p className="value">2020/03/03 20:32</p>
          </div>
        </div>
        <div className="wrap-top" style={{ marginTop: '20pt' }}>
          <div>
            <p className="name">车辆图片</p>
            <img src={require('../../../images/bg.png')} />
          </div>
          <div>
            <p className="name">车辆图片</p>
            <img src={require('../../../images/bg.png')} />
          </div>
        </div>
      </div>
    </div>
  )

  render() {
    const { data } = this.props
    return (
      <div className="panel">
        <div className="info">车牌关键字：A123456</div>
        {data ? (
          <Collapse accordion className="panle-dialog">
            <Panel header={this.renderHeader()} key="1" showArrow={false}>
              {this.getContent()}
            </Panel>
            <Panel header={this.renderHeader()} key="2" showArrow={false}>
              {this.getContent()}
            </Panel>
            <Panel header={this.renderHeader()} key="3" showArrow={false}>
              {this.getContent()}
            </Panel>
          </Collapse>
        ) : (
          <div className="empty">
            <img src={require('../../../images/home/no-img.png')} />
            未搜索到车牌
          </div>
        )}
      </div>
    )
  }
}

export default CarNumber
