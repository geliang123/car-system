/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import '../../less/normal.less'
import './style.less'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'

const pageSize = 2
@hot
@withRouter
class EventRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      searchContent: '',
      current: 1, // 当前页
      visible: false,
      total: 0,
    }
    this.headers = [
      {
        title: '时间',
        dataIndex: 'id',
        key: 'ID'
      },
      {
        title: '停车场',
        dataIndex: 'parkName',
        key: 'parkName'
      },
      {
        title: '车牌',
        dataIndex: 'carNum',
        key: 'carNum'
      },
      {
        title: '入场时间',
        dataIndex: 'inTimeStr',
        key: 'inTimeStr'
      },
      {
        title: '出场时间',
        dataIndex: 'outTimeStr',
        key: 'outTimeStr'
      },
      {
        title: '支付费用',
        dataIndex: 'payAmount',
        key: 'payAmount'
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        render: (text, record) => (
          <div>
            <span className="watch-info" onClick={() => this.watchInfo(record)}>
              查看详情
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

  // 查看图片
  watchImage = item => {
    this.setState({
      visible: true
    })
  }

  // 查看信息
  watchInfo = item => {
    this.props.history.push('/detail', { data: item })
  }

  // 确认
  confirm = () => {}

  getList = () => {
    const { current, searchContent } = this.state
    let url = `${urlCng.callList}?pageSize=${pageSize}&curPage=${current}&status=4`
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
    this.setState({
      current: pageNumber
    })
  }

  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { data, searchContent, current, visible, total } = this.state
    return (
      <div className="panel">
        <div id="eventRecord">
          <div className="search-wrap">
            <Button className="add" onClick={this.add}>
              新建账号
            </Button>
            <div className="search">
              <Input
                className="search-content"
                placeholder="请输入账户关键词"
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

export default EventRecord
