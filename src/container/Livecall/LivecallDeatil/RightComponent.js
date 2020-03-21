import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { Input, Button, message } from 'antd'
import '../../../less/normal.less'
import './style.less'
import SelectMenu from '~/component/SelectMenu'

const { TextArea } = Input
const dropData = [
  {
    id: '1',
    displayName: '车牌识别错误'
  },
  {
    id: '2',
    displayName: '支付未开闸'
  },
  {
    id: '3',
    displayName: '未显示二维码'
  },
  {
    id: '',
    displayName: '其他原因'
  }
]
@hot
@withRouter
class RightComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionSelected: '',
      comments: '',
      disabled: true,
      carNumber: props.data && props.data.carNum
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.carNum !== prevState.carNumber) {
      return { carNumber: nextProps.data.carNum }
    }
    return null
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e
    })
  }

  handleChange = v => {
    this.setState({
      comments: v.target.value
    })
  }

  // 提交
  submit = () => {
    const { comments } = this.state
    if (comments.length < 4) {
      message.warning('问题描述需要大于4个文字')
    }
  }

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
  }

  // 修改车牌
  modifyCarNum = () => {
    this.setState({
      disabled: false
    })
  }

  render() {
    const { questionSelected, comments, carNumber, disabled } = this.state
    const { data } = this.props
    return (
      <div className="right">
        <div className="top-title">
          <span style={{ marginLeft: '13.5pt' }}>红星大厦停车场</span>
          <span style={{ marginRight: '13.5pt' }}>2020-03-03</span>
        </div>
        <div className="wrap-info car">
          <div className="label">车牌号:</div>
          <Input
            placeholder="请输入车牌号"
            disabled={disabled}
            allowClear
            className="car-num"
            value={carNumber}
            onChange={e => this.changeValue(e, 'carNumber')}
          />
        </div>
        {/* 操作按钮 */}
        <div className="wrap-info">
          <div className="info-item">
            <p className="text">等待时长</p>
            <p className="duration">03:32</p>
            <div className="op-btn in">入场开闸</div>
          </div>
          <div className="info-item">
            <p className="text">剩余车位</p>
            <p className="duration">10</p>
            <div className="op-btn free" onClick={this.modifyCarNum}>
              修改车牌
            </div>
          </div>
          <div className="info-item">
            <p className="text">收费标准</p>
            <p className="duration">¥10(每小时)</p>
            <div className="op-btn operate">现场处理</div>
          </div>
        </div>
        {/* 提交内容 */}
        <div className="wrap-bottom">
          <div className="drop-wrap">
            <div className="label">问题类型:</div>
            <SelectMenu
              data={dropData}
              style={{ background: '#eee', width: '85%' }}
              className="detailDrop"
              change={e => this.dropChange(e, 'questionSelected')}
              defaultValue={questionSelected}
            />
          </div>
          <TextArea
            placeholder="请描述问题(4-100)"
            autosize={{ minRows: 3, maxRows: 6 }}
            value={comments}
            onChange={v => this.handleChange(v)}
            maxLength="100"
            minLength="4"
            style={{
              borderRadius: '2pt',
              width: '100%',
              resize: 'none',
              background: '#EAF0FD',
              color: '#707070',
              fontSize: '10pt',
              marginTop: '15pt',
              marginBottom: '25.5pt'
            }}
          />
          <Button className="sumbit" onClick={this.submit}>
            提交
          </Button>
        </div>
      </div>
    )
  }
}

export default RightComponent
