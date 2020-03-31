/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Table, Button, Input, message, Modal } from 'antd'
import { hot } from 'react-hot-loader/root'
import eventObject from '~/config/eventSignal'
import Add from './Add/index'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import '../../less/normal.less'
import './style.less'
import { getStore } from '~/utils'

const pageSize = 10
@hot
class CarManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      searchContent: '',
      current: 1, // 当前页
      total: 0,
      visible: false,
      loading: true
    }
    this.headers = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '状态',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '停车场名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '设备编号',
        dataIndex: 'code',
        key: 'code'
        // render: value => <div>{this.getNameById(value)}</div>
      },
      {
        title: '对应IP',
        dataIndex: 'detailInfo',
        key: 'detailInfo'
      },
      {
        title: '对应闸口',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
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
            <span className="edit" onClick={() => this.addEquipment(record)}>
              新增设备
            </span>
          </div>
        )
      }
    ]
    this.parkList = JSON.parse(getStore('parkList'))
  }

  componentDidMount() {
    this.getList()
  }

  changeValue = e => {
    this.setState({
      searchContent: e.target.value
    })
  }

  addEquipment = item => {
    this.selectItem = item
    this.dialogTitle = '新增设备'
    this.op = 'equip'
    this.setState({
      visible: true
    })
  }

  getNameById = id => {
    const item = this.parkList.filter(v => v.id === id)
    if (item && item.length) {
      return item[0].name
    }
    return null
  }

  getList = () => {
    const { current, searchContent } = this.state // &userName=${searchContent}
    let url = `${urlCng.equipList}?pageSize=${pageSize}&curPage=${current}`
    if (searchContent) {
      url += `&userName=${searchContent}`
    }
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result,
          total: 30, // res.result.page.totalNum,
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
    this.dialogTitle = '编辑车场'
    this.op = 'edit'
    this.setState({
      visible: true
    })
  }

  // 新增
  add = () => {
    this.selectItem = {}
    this.dialogTitle = '新建车场'
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
      case 'equip':
        return <Add data={this.selectItem} op={op} updateData={this.getList} />
      case 'del':
        return <div className="del-text">确认删除?</div>
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
    const { data, searchContent, current, total, visible, loading } = this.state
    return (
      <div className="panel">
        <div id="Account">
          <div className="search-wrap">
            <Button className="add" onClick={this.add}>
              新建车场
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

export default CarManage
