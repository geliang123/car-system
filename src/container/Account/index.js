/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, message, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import { showConfirm } from '../../utils/ViewUtils'
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
      searchContent: '',
      current: 1, // 当前页
      total: 0,
      visible: false
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
            <span className="del" onClick={() => this.delete(record, 'del')}>
              删除
            </span>
            <span className="edit" onClick={() => this.edit(record, 'edit')}>
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

  getNameById = id => {
    const item = accountArr.filter(v => v.id === id)
    if (item && item.length) {
      return item[0].displayName
    }
    return null
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
      } else {
        message.error(res.msg)
      }
    })
  }

  // 删除
  delete = item => {
    this.ref = showConfirm(
      () => this.deleteData(item),
      <div className="del-text">确认删除“{item.userName}”账号?</div>,
      '提示',
      458
    )
  }

  deleteData = item => new Promise((resolve, reject) => {
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
        message.error(res.msg)
      }
    })
    reject
  })

  // 编辑
  edit = item => {
    this.selectRecord = item
    this.ref = showConfirm(
      () => this.confirm(),
      <Add data={item} op="edit" updateData={this.getList} />,
      '编辑账号',
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
  confirm = () => new Promise((resolve, reject) => {
    eventObject.accountEvent.dispatch(this.ref)
    reject
  }).catch(() => console.log('Oops errors!'))

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
    const { data, searchContent, current, total, visible } = this.state
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
        {/* 弹框 */}
        {/* <Modal
          title="车辆图片"
          visible={visible}
          className="watch-image-dialog"
          okText="确认"
          cancelText="关闭"
          onCancel={this.handleCancel}
          width={457}
          destroyOnClose
          confirmLoading={false}
        >
          <img src={require('../../images/bg.png')} width="457" height="270" />
        </Modal> */}
      </div>
    )
  }
}

export default Livecall
