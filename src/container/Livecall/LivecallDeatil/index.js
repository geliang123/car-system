import { withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { Input, Button, message } from 'antd'
import '../../../less/normal.less'
import './style.less'
import Title from '~/component/Title'
import SelectMenu from '~/component/SelectMenu'
import urlCng from '~/config/url'
import { getStore, setStore } from '~/utils'
import fetch from '~/utils/fetch'

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
class LivecallDeatil extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionSelected: '',
      comments: '',
      data: {}
    }
  }

  componentDidMount() {
    const { location } = this.props
    const callDetailId =
      (location.state.data && location.state.data.parkId) ||
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

  getDetail = id => {
    const url = `${urlCng.callDetail}?id=${id}`
    fetch({
      url
    }).then(res => {
      console.log(res)
      if (res.code === 1) {
      }
    })
  }

  render() {
    const { questionSelected, comments } = this.state
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
                <div>
                  <div className="mute">
                    <span className="icon" />
                    <span>静音</span>
                  </div>
                  <div className="hangup">
                    <span className="icon" />
                    <span>挂断</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 左边内容 */}
            <div className="right">
              <div className="top-title">
                <span style={{ marginLeft: '13.5pt' }}>红星大厦停车场</span>
                <span style={{ marginRight: '13.5pt' }}>2020-03-03</span>
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
                  <div className="op-btn free">免费放行</div>
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
          </div>
        </div>
      </div>
    )
  }
}

export default LivecallDeatil
