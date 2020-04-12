import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import {
  Input,
  Button,
  message,
  DatePicker,
  Modal,
  Popconfirm,
  LocaleProvider,
} from 'antd'
import '../../../less/normal.less'
import './style.less'
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import SelectMenu from '~/component/SelectMenu'
import urlCng from '~/config/url'
import fetch from '~/utils/fetch'
import { getColor } from '~/utils'
import CollapseComponent from './CollapseComponent'

import 'moment/locale/zh-cn'

const { RangePicker } = DatePicker
const { TextArea } = Input
const dropData = [
  {
    id: 'car',
    name: '车牌',
  },
  {
    id: 'time',
    name: '时间',
  },
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
      visible: false,
      deatilData: [], // 弹框信息
    }
    this.strTime = ''
    this.flag = false
    this.selectCarObj = {}
    this.operateType = ''
  }

  componentDidMount() {
    const { data } = this.props
    const m1 = moment(data.createTimeStr)
    const m2 = moment()
    this.duration = m2.diff(m1, 'seconds')
    this.getProblemList()
    this.updateSystemTime()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.carNum !== this.props.carNum) {
      const m1 = moment(nextProps.data.createTimeStr)
      const m2 = moment()
      this.duration = m2.diff(m1, 'seconds')
      this.setState({
        carNumber: nextProps.data.carNum,
        questionSelected: nextProps.data.problemId,
      })
      this.updateSystemTime()
    }
  }

  componentWillUnmount() {
    if (this.updateTimer) clearTimeout(this.updateTimer)
  }

  updateSystemTime = () => {
    if (this.updateTimer) clearTimeout(this.updateTimer)
    const p = document.getElementById('nowTime')
    if (p) {
      const time = new Date()
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const day = time.getDate()
      const hour = time.getHours()
      const minutes = time.getMinutes()
      const seconds = time.getSeconds()
      const str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
      p.innerText = str
      this.updateTimer = window.setTimeout(this.updateSystemTime, 1000)
    }
  }

  getProblemList = () => {
    fetch({
      url: urlCng.callProblem,
    }).then(res => {
      if (res.code === 1) {
        const data = []
        for (let i = 0; i < res.result.length; i++) {
          data.push({
            id: res.result[i].code,
            name: res.result[i].text,
          })
        }
        this.setState({
          probleList: data,
        })
      }
    })
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e,
    })
  }

  handleChange = v => {
    this.setState({
      comments: v.target.value,
    })
  }

  // 提交
  submit = () => {
    if (!this.operateType) {
      message.warning('请选择处理方式')
      return
    }
    if (!Object.keys(this.selectCarObj).length) {
      message.warning('未检索车牌不能提交')
      return
    }
    const { comments, questionSelected } = this.state
    const { data } = this.props
    if (comments.length < 4) {
      message.warning('问题描述需要大于4个文字')
      return
    }
    const operatedSum = document.getElementById('allSecond').innerText
    const params = Object.assign(
      {},
      {
        remark: comments,
        id: data.id,
        problemId: questionSelected,
        status: 4,
        operatedType: this.operateType,
        operatedSum: operatedSum && parseInt(operatedSum),
      },
      this.selectCarObj
    )
    if (data.id) {
      fetch({
        url: urlCng.callUpdate,
        method: 'POST',
        data: params,
      }).then(res => {
        if (res.code === 1) {
          message.success('提交成功')
          this.props.goback()
          this.props.close()
        } else {
          message.success('提交失败')
        }
      })
    }
  }

  changeValue = (e, key) => {
    this.str = e.target.value
    this.setState({
      [key]: e.target.value,
    })
  }

  filter = () => {
    fetch({
      url: urlCng.callUpdate,
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
    this.operateType = 1 // 免费开闸
    if (!this.flag) {
      fetch({
        url: urlCng.open,
        method: 'POST',
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

  // 现场处理
  operateCurrent = () => {
    this.operateType = 3
  }

  // 检索
  search = () => {
    fetch({
      url: urlCng.searchCar,
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          visible: true,
          deatilData: res.result,
        })
      } else {
        message.success('检索失败')
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  selectCarItem = item => {
    this.selectCarObj = item
    this.handleCancel()
  }

  // 时间改变
  onChangeDate = (dates, dateStrings) => {
    this.str = `${dateStrings[0]}-${dateStrings[1]}`
  }

  render() {
    const {
      questionSelected,
      comments,
      carNumber,
      probleList,
      type,
      visible,
      deatilData,
    } = this.state
    const { data } = this.props
    const dataKeys = Object.keys(data)
    return (
      <div className="right">
        <div className="top-title">
          <span style={{ marginLeft: '13.5pt' }}>
            {dataKeys.length && data.parkName}
          </span>
          <span id="nowTime" style={{ marginRight: '13.5pt' }} />
        </div>
        <div className="wrap-info car">
          <div className="label">车牌号:</div>
          <SelectMenu
            data={dropData}
            className="select-type"
            change={e => this.dropChange(e, 'type')}
            defaultValue={type}
            style={{ width: '55.5pt', marginRight: '5pt' }}
          />
          {type === 'car' ? (
            <Input
              placeholder="请输入车牌关键词"
              className="car-num"
              value={carNumber}
              onChange={e => this.changeValue(e, 'carNumber')}
            />
          ) : (
            <LocaleProvider locale={zh_CN}>
              <RangePicker
                allowClear
                showTime={{ format: 'HH:mm' }}
                format="YYYY/MM/DD HH:mm"
                onChange={this.onChangeDate}
                style={{ width: '310px' }}
                placeholder={['开始时间', '结束时间']}
              />
            </LocaleProvider>
          )}
        </div>
        <div
          className="wrap-info"
          style={{ marginTop: '10px', justifyContent: 'flex-end' }}
        >
          <Button className="filter" onClick={this.search}>
            检索
          </Button>
        </div>
        {/* 操作按钮 */}
        <div className="wrap-info">
          <div className="info-item">
            <p className="text">等待时长</p>
            <p className="duration" style={{ color: getColor(this.duration) }}>
              {this.duration}s
            </p>
          </div>
          <div className="info-item">
            <Popconfirm
              title="请确认是否对闸口进行放行?"
              onConfirm={this.open}
              okText="确定"
              cancelText="取消"
            >
              <div className="op-btn in">入场开闸</div>
            </Popconfirm>
          </div>
          <div className="info-item">
            <Popconfirm
              title="请联系停车场管理人员 电话:15317035193"
              okText="确定"
              cancelText="取消"
              style={{ width: '200px' }}
            >
              <div className="op-btn operate" onClick={this.operateCurrent}>
                现场处理
              </div>
            </Popconfirm>
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
              marginBottom: '25.5pt',
            }}
          />
          <Button className="sumbit" onClick={this.submit}>
            提交
          </Button>
        </div>
        {/* 弹框 */}
        <Modal
          title={type === 'car' ? '车牌检索' : '时间检索'}
          visible={visible}
          className="watch-image-dialog panle-dialog"
          okText="确认"
          cancelText=""
          onCancel={this.handleCancel}
          width={908}
          destroyOnClose
          confirmLoading={false}
        >
          <CollapseComponent
            type={type}
            data={deatilData}
            keyword={carNumber}
            str={this.str}
            selectCarItem={this.selectCarItem}
          />
        </Modal>
      </div>
    )
  }
}

export default RightComponent
