import React, { Component } from 'react'
import { Table, Button, Input, Modal, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import '../../less/normal.less'
import './style.less'
import urlCng from '~/config/url'
import fetch from '~/utils/fetch'
import SelectMenu from '~/component/SelectMenu'
import { getUrl } from '~/utils/index'

const pageSize = 10
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
      loading: true,
      selected: 'all',
      parkList: [],
    }
    this.headers = [
      {
        title: '时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
      },
      {
        title: '停车场',
        dataIndex: 'parkName',
        key: 'parkName',
      },
      {
        title: '车牌',
        dataIndex: 'carNum',
        key: 'carNum',
      },
      {
        title: '入场时间',
        dataIndex: 'inTimeStr',
        key: 'inTimeStr',
      },
      {
        title: '出场时间',
        dataIndex: 'outTimeStr',
        key: 'outTimeStr',
      },
      {
        title: '支付费用',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },
      {
        title: '状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
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
        ),
      },
    ]
  }

  componentDidMount() {
    this.getList()
    this.getParkPos()
  }

  changeValue = (e) => {
    this.setState({
      searchContent: e.target.value,
    })
  }

  // 查看信息
  watchInfo = (item) => {
    if (item.id) {
      this.props.history.push('/detail', { data: item })
    }
  }

  // 确认
  confirm = () => {}

  getList = () => {
    const { current, searchContent, selected } = this.state // &userName=${searchContent}
    const params = {
      pageSize,
      curPage: current,
    }
    // 车牌号
    if (searchContent) {
      params.caNumStr = searchContent
    }
    // 停车场
    if (selected !== 'all') {
      params.parkId = selected
    }
    const url = getUrl(params, `${urlCng.callList}`)
    fetch({
      url,
    }).then((res) => {
      if (res.code === 1) {
        this.setState({
          data: res.result.data,
          total: res.result.page.totalNum,
          loading: false,
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  getParkPos = () => {
    fetch({
      url: urlCng.parkList,
    }).then((res) => {
      if (res.code === 1) {
        if (res.result && res.result.data) {
          const resData = res.result.data
          resData.unshift({
            id: 'all',
            name: '全部',
          })
          this.setState({
            parkList: resData,
          })
        }
      }
    })
  }

  // 分页
  handlePageChange = (pageNumber) => {
    this.setState(
      {
        current: pageNumber,
      },
      () => {
        this.getList()
      }
    )
  }

  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  // 下拉改变
  dropChange = (e, key) => {
    this.setState({
      [key]: e,
    })
  }

  // 筛选
  filter = () => {
    this.setState({ current: 1 }, () => {
      this.getList()
    })
  }

  render() {
    const {
      data,
      searchContent,
      current,
      visible,
      total,
      selected,
      loading,
      parkList,
    } = this.state
    return (
      <div className="panel">
        <div id="eventRecord">
          <div className="search-wrap">
            <div>
              <SelectMenu
                data={parkList}
                change={(e) => this.dropChange(e, 'selected')}
                defaultValue={selected}
              />
              <Button className="filter" onClick={this.filter}>
                筛选
              </Button>
            </div>
            <div className="search">
              <Input
                className="search-content"
                placeholder="请输入车牌关键词"
                value={searchContent}
                onChange={(e) => this.changeValue(e, 'username')}
              />
              <Button className="search-btn" onClick={this.filter}>
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
              onChange: this.handlePageChange,
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
