/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import '../../less/normal.less'
import './style.less'
import defaultData from '../Account/data.json'

@hot
@withRouter
class EventRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: defaultData.data,
      searchContent: '',
      current: 1, // 当前页
      visible: false,
      url: ''
    }
    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'ID'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        render: (text, record) => (
          <div>
            <span
              className="watch-image"
              onClick={() => this.watchImage(record)}
            >
              车辆图片
            </span>
            <span className="watch-info" onClick={() => this.watchInfo(record)}>
              查看详情
            </span>
          </div>
        )
      }
    ]
  }

  componentDidMount() {}

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
    this.props.history.push('/detail')
  }

  // 确认
  confirm = () => {}

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
    const { data, searchContent, current, visible } = this.state
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
            共57条记录 <span className="page-num">每页10条</span>
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
