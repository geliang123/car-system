import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { Input, Button, message, DatePicker, Modal } from 'antd'
import '../../../less/normal.less'
import './style.less'
import moment from 'moment'
import SelectMenu from '~/component/SelectMenu'
import urlCng from '~/config/url'
import fetch from '~/utils/fetch'
import { getColor } from '~/utils'
import CollapseComponent from './CollapseComponent'

const { RangePicker } = DatePicker
const { TextArea } = Input
const dropData = [
  {
    id: 'car',
    name: '车牌'
  },
  {
    id: 'time',
    name: '时间'
  }
]
@hot
@withRouter
class RightComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionSelected: props.data && props.data.problemId,
      comments: '',
      carNumber: props.data && props.data.carNum,
      probleList: [],
      type: 'car',
      visible: false
    }
    this.flag = false
  }

  componentDidMount() {
    this.getProblemList()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.carNum !== this.props.carNum) {
      this.setState({
        carNumber: nextProps.data.carNum,
        questionSelected: nextProps.data.problemId
      })
    }
  }

  getProblemList = () => {
    fetch({
      url: urlCng.callProblem
    }).then(res => {
      if (res.code === 1) {
        const data = []
        for (let i = 0; i < res.result.length; i++) {
          data.push({
            id: res.result[i].code,
            name: res.result[i].text
          })
        }
        this.setState({
          probleList: data
        })
      }
    })
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
    const { comments, carNumber, questionSelected } = this.state
    const { data } = this.props
    if (comments.length < 4) {
      message.warning('问题描述需要大于4个文字')
      return
    }
    const params = {
      remark: comments,
      carNum: carNumber,
      id: data.id,
      problemId: questionSelected
    }
    if (data.id) {
      fetch({
        url: urlCng.callUpdate,
        method: 'POST',
        data: params
      }).then(res => {
        if (res.code === 1) {
          message.success('提交成功')
        } else {
          message.success('提交失败')
        }
      })
    }
  }

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
  }

  filter = () => {
    fetch({
      url: urlCng.callUpdate
    }).then(res => {
      if (res.code === 1) {
        message.success('提交成功')
      } else {
        message.success('提交失败')
      }
    })
  }

  // 入场
  open = () => {
    if (!this.flag) {
      fetch({
        url: urlCng.open,
        method: 'POST'
      }).then(res => {
        if (res.code === 1) {
          this.flag = true
          message.success('开闸成功')
        } else {
          message.success('开失败成功')
        }
      })
    }
  }

  // 检索
  search = () => {
    // this.setState({
    //   visible: true
    // })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const {
      questionSelected,
      comments,
      carNumber,
      probleList,
      type,
      visible
    } = this.state
    const { data } = this.props
    if (!Object.keys(data).length) return null
    const m1 = moment(data.createTimeStr)
    const m2 = moment()
    const duration = m2.diff(m1, 'seconds')
    return (
      <div className="right">
        <div className="top-title">
          <span style={{ marginLeft: '13.5pt' }}>{data.parkName}</span>
          <span style={{ marginRight: '13.5pt' }}>{data.createTimeStr}</span>
        </div>
        <div className="wrap-info car">
          <div className="label">车牌号:</div>
          <SelectMenu
            data={dropData}
            className="select-type"
            change={e => this.dropChange(e, 'type')}
            defaultValue={type}
            style={{ width: '75.5pt', marginRight: '15pt' }}
          />
          {type === 'car' ? (
            <Input
              placeholder="请输入车牌关键词"
              className="car-num"
              value={carNumber}
              onChange={e => this.changeValue(e, 'carNumber')}
            />
          ) : (
            <RangePicker className="car-num" />
          )}

          <Button className="filter" onClick={this.search}>
            检索
          </Button>
        </div>
        {/* 操作按钮 */}
        <div className="wrap-info">
          <div className="info-item">
            <p className="text">等待时长</p>
            <p className="duration" style={{ color: getColor(duration) }}>
              {duration}s
            </p>
          </div>
          <div className="info-item">
            {/* <p className="text">剩余车位</p>
            <p className="duration">10</p> */}
            {/* <div className="op-btn free" onClick={this.modifyCarNum}>
              修改车牌
            </div> */}
            <div className="op-btn in" onClick="this.open">
              入场开闸
            </div>
          </div>
          <div className="info-item">
            {/* <p className="text">收费标准</p>
            <p className="duration">¥10(每小时)</p> */}
            <div className="op-btn operate">现场处理</div>
          </div>
        </div>
        {/* 提交内容 */}
        <div className="wrap-bottom">
          <div className="drop-wrap">
            <div className="label">问题类型:</div>
            <SelectMenu
              data={probleList}
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
        {/* 弹框 */}
        <Modal
          title="客服端检测"
          visible={visible}
          className="watch-image-dialog"
          okText="确认"
          cancelText=""
          onCancel={this.handleCancel}
          width={908}
          height={500}
          destroyOnClose
          confirmLoading={false}
        >
          <CollapseComponent />
        </Modal>
      </div>
    )
  }
}

export default RightComponent
