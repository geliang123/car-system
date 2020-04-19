/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, message, Modal, Spin } from 'antd'
import { hot } from 'react-hot-loader/root'
import eventObject from '~/config/eventSignal'
import Add from './Add/index'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import accountArr from '~/config/dropData'
import '../../less/normal.less'
import './style.less'

const pageSize = 10
@hot
class Livecall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      userName: '',
      realName: '',
      current: 1, // 当前页
      total: 0,
      visible: false,
      loading: true
    }
    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName'
      },
      // {
      //   title: '密码',
      //   dataIndex: 'password',
      //   key: 'password'
      // },
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName'
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        render: value => <div>{this.getNameById(value)}</div>
      },
      {
        title: '手机号',
        dataIndex: 'tel',
        key: 'tel'
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

  componentDidMount() {
    this.getList()
  }

  changeUserName = e => {
    this.setState({
      userName: e.target.value
    })
  }

  changeRealName = e => {
    this.setState({
      realName: e.target.value
    })
  }

  getNameById = id => {
    const item = accountArr.filter(v => v.id === id)
    if (item && item.length) {
      return item[0].displayName
    }
    return null
  }

  getList = () => {
    const { current, userName, realName } = this.state // &userName=${searchContent}
    let url = `${urlCng.accountList}?pageSize=${pageSize}&curPage=${current}`
    if (userName) {
      url += `&userName=${userName}`
    }
    if (realName) {
      url += `&realName=${realName}`
    }
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result.data,
          total: res.result.page.totalNum,
          visible: false,
          loading: false
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  deleteData = () => {
    if (this.selectItem.id) {
      fetch({
        url: urlCng.accountDel,
        method: 'POST',
        data: { id: this.selectItem.id }
      }).then(res => {
        if (res.code === 1) {
          this.getList()
          message.success('删除成功')
        } else {
          message.error(res.msg)
        }
      })
    }
  }

  // 编辑
  edit = item => {
    this.selectItem = item
    this.dialogTitle = '编辑账号'
    this.op = 'edit'
    this.setState({
      visible: true
    })
  }

  // 新增
  add = () => {
    this.selectItem = {}
    this.dialogTitle = '新增账号'
    this.op = 'add'
    this.setState({
      visible: true
    })
  }

  // 删除
  delete = item => {
    this.selectItem = item
    this.dialogTitle = '提示'
    this.op = 'del'
    this.setState({
      visible: true
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

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  // 搜索
  search = () => {
    this.setState({ current: 1 }, () => {
      this.getList()
    })
  }

  // 获取新增还是删除
  getComponent = op => {
    switch (op) {
      case 'edit':
        return <Add data={this.selectItem} op={op} updateData={this.getList} />
      case 'add':
        return <Add data={this.selectItem} op={op} updateData={this.getList} />
      case 'del':
        return (
          <div className="del-text">
            确认删除“{this.selectItem.userName}”账号?
          </div>
        )
      default:
        break
    }
  }

  updateVisible = visible => {
    this.setState({
      visible
    })
  }

  onOk = () => {
    if (this.op === 'del') {
      this.deleteData()
    } else {
      eventObject.accountEvent.dispatch(this.ref)
    }
  }

  render() {
    const { data, userName, realName, current, total, visible, loading } = this.state
    return (
      <div className="panel">
        <div id="Account">
          <div className="search-wrap">
            <Button className="add" onClick={this.add}>
              新建账号
            </Button>
            <div className="search">
              <Input
                className="search-content"
                placeholder="请输入账户关键词"
                value={userName}
                onChange={e => this.changeUserName(e, 'username')}
                style={{ width: '200pt' }}
              />
              <Input
                className="search-content"
                placeholder="请输入姓名关键词"
                value={realName}
                onChange={e => this.changeRealName(e, 'realname')}
                style={{ width: '200pt' }}
              />
              <Button className="search-btn" onClick={this.search}>
                搜索
              </Button>
            </div>
          </div>
          {/* 表格数据 */}
          <Table
            dataSource={data}
            columns={this.headers}
            rowKey={(record, index) => index}
            loading={loading}
            locale={{ emptyText: '暂无数据' }}
            pagination={{
              total,
              pageSize,
              current,
              onChange: this.handlePageChange
            }}
          />
          <div className="total">
            共{total}条记录 <span className="page-num">每页10条</span>
          </div>
        </div>
        {/* 弹框 */}
        <Modal
          title={this.dialogTitle}
          visible={visible}
          className="accout-dialog"
          okText="确认"
          cancelText="关闭"
          onCancel={this.handleCancel}
          onOk={this.onOk}
          width={457}
          destroyOnClose
        >
          {this.getComponent(this.op)}
        </Modal>
      </div>
    )
  }
}

export default Livecall
