/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import { showConfirm } from '../../../utils/ViewUtils'
import Add from './Add/index'
import '../../../less/normal.less'
import './style.less'
import defaultData from './data.json'

@hot
class Livecall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: defaultData.data,
      searchContent: '',
      current: 1, // 当前页
      visible: false,
      op: 'del'
    }
    this.headers = [
      {
        title: '时间',
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
            <span className="del" onClick={() => this.delete(record)}>
              删除
            </span>
            <span className="edit" onClick={() => this.edit(record)}>
              编辑
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

  // 删除
  delete = item => {
    // this.setState({
    //   visible: true,
    //   op: 'del'
    // })
    this.ref = showConfirm(
      () => this.confirm(),
      <div className="del-text">是否确认删除?</div>,
      '删除',
      440
    )
  }

  // 编辑
  edit = item => {
    this.selectRecord = item
    this.ref = showConfirm(
      () => this.confirm(),
      <Add data={item} />,
      '新建账号',
      458
    )
  }

  // 新增
  add = () => {
    this.ref = showConfirm(() => this.confirm(), <Add />, '新建账号', 458)
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
  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { data, searchContent, current, visible, op } = this.state
    const title = op === 'edit' ? '编辑账号' : '新建账号'
    return (
      <div id="Account">
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
          title={title}
          visible={visible}
          onOk={this.handleOk}
          okText="确认"
          cancelText="关闭"
          onCancel={this.handleCancel}
          width={458}
        />
      </div>
    )
  }
}

export default Livecall
