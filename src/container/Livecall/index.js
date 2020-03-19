/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import '../../less/normal.less'
import './style.less'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import SelectMenu from '~/component/SelectMenu'

const pageSize = 2
const dropData = [
  {
    id: 'all',
    displayName: '全部'
  },
  {
    id: '1',
    displayName: '停车场'
  },
  {
    id: '2',
    displayName: '出入场'
  },
  {
    id: '3',
    displayName: '等待时长'
  }
]

@hot
@withRouter
class Livecall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      searchContent: '',
      current: 1, // 当前页
      visible: false,
      selected: 'all',
      total: 0
    }
    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'ID'
      },
      {
        title: '停车场',
        dataIndex: 'parkName',
        key: 'parkName'
      },
      {
        title: '出入场',
        dataIndex: 'inOutStr',
        key: 'inOutStr'
      },
      {
        title: '车牌号',
        dataIndex: 'carNum',
        key: 'carNum'
      },
      {
        title: '呼叫时间',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: '等待时长',
        dataIndex: 'waitCountTime',
        key: 'waitCountTime'
      },
      {
        title: '事件处理',
        dataIndex: 'op',
        key: 'op',
        render: (text, record) => (
          <div>
            <span className="online" onClick={() => this.answer(record)}>
              通话中
            </span>
            <span className="hang-up" onClick={() => this.watchInfo(record)}>
              挂断
            </span>
            <span
              className="not-operate"
              onClick={() => this.watchInfo(record)}
            >
              暂不处理
            </span>
          </div>
        )
      }
    ]
  }

  componentDidMount() {
    this.getList()
  }

  changeValue = e => {
    this.setState({
      searchContent: e.target.value
    })
  }

  // 进入详情
  answer = item => {
    this.props.history.push('/livedetail', { data: item })
  }

  // 查看信息
  watchInfo = item => {}

  getList = () => {
    const { current, searchContent } = this.state // &userName=${searchContent}
    let url = `${urlCng.callList}?pageSize=${pageSize}&curPage=${current}`
    if (searchContent) {
      url += `&userName=${searchContent}`
    }
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result.data,
          total: res.result.page.totalNum
        })
      }
    })
  }

  // 分页
  handlePageChange = pageNumber => {
    this.setState(
      {
        current: pageNumber
      },
      () => {
        this.getList()
      }
    )
  }

  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e
    })
  }

  render() {
    const {
      data,
      searchContent,
      current,
      visible,
      selected,
      total
    } = this.state
    return (
      <div className="panel">
        <div id="liveCall">
          <div className="search-wrap">
            <div>
              <SelectMenu
                data={dropData}
                change={e => this.dropChange(e, 'selected')}
                defaultValue={selected}
              />
              <Button className="filter" onClick={this.filter}>
                筛选
              </Button>
            </div>
            <div className="search">
              <Input
                className="search-content"
                placeholder="请输入车牌号关键词"
                value={searchContent}
                onChange={e => this.changeValue(e, 'username')}
              />
              <Button className="search-btn">搜索</Button>
            </div>
          </div>
          {/* 表格数据 */}
          <Table
            dataSource={data}
            columns={this.headers}
            scroll={{ x: true }}
            rowKey={(record, index) => index}
            pagination={{
              total,
              pageSize,
              current,
              onChange: this.handlePageChange
            }}
          />
          <div className="total">
            共{total}条记录 <span className="page-num">每页{pageSize}条</span>
          </div>
          {/* 弹框 */}
          <Modal
            title="车辆图片"
            visible={visible}
            className="watch-image-dialog"
            okText="确认"
            cancelText="关闭"
            onCancel={this.handleCancel}
            width={457}
          >
            <img
              src={require('../../images/bg.png')}
              width="457"
              height="270"
            />
          </Modal>
        </div>
      </div>
    )
  }
}

export default Livecall
