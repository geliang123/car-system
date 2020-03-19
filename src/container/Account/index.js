/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import { showConfirm } from '../../utils/ViewUtils'
import eventObject from '~/config/eventSignal'
import Add from './Add/index'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import '../../less/normal.less'
import './style.less'

const pageSize = 2
@hot
class Livecall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      searchContent: '',
      current: 1, // 当前页
      total: 0
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
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password'
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName'
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId'
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

  changeValue = e => {
    this.setState({
      searchContent: e.target.value
    })
  }

  getList = () => {
    const { current, searchContent } = this.state // &userName=${searchContent}
    let url = `${urlCng.accountList}?pageSize=${pageSize}&curPage=${current}`
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

  // 删除
  delete = item => {
    this.ref = showConfirm(
      () => this.deleteData(item),
      <div className="del-text">确定删除“{item.userName}”账号吗？?</div>,
      '提示',
      458
    )
  }

  deleteData = item => {
    fetch({
      url: urlCng.accountDel,
      method: 'POST',
      data: { id: item.id }
    }).then(res => {
      if (res.code === 1) {
        this.ref.destroy()
        this.getList()
        message.success('删除成功')
      } else {
        message.waring('删除失败')
      }
    })
    return new Promise((resolve, reject) => {
      reject
    }).catch(() => console.log('Oops errors!'))
  }

  // 编辑
  edit = item => {
    this.selectRecord = item
    this.ref = showConfirm(
      () => this.confirm(),
      <Add data={item} op="edit" updateData={this.getList} />,
      '新建账号',
      458
    )
  }

  // 新增
  add = () => {
    this.ref = showConfirm(
      () => this.confirm(),
      <Add op="add" updateData={this.getList} />,
      '新建账号',
      458
    )
  }

  // 确认
  confirm = () => {
    eventObject.accountEvent.dispatch(this.ref)
    return new Promise((resolve, reject) => {
      reject
    }).catch(() => console.log('Oops errors!'))
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

  // 搜索
  search = () => {
    this.setState({ current: 1 }, () => {
      this.getList()
    })
  }

  render() {
    const { data, searchContent, current, total } = this.state
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
                value={searchContent}
                onChange={e => this.changeValue(e, 'username')}
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
            共{total}条记录 <span className="page-num">每页10条</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Livecall
