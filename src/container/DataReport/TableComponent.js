import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import './style.less'
import defaultData from '../Account/data.json'

@hot
class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: defaultData.data,
      current: 1 // 当前页
    }
    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'ID'
      },
      {
        title: '坐席名称',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '当前状态',
        dataIndex: 'password',
        key: 'password'
      },
      {
        title: '总登录时长',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '总通话时长',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: '电话呼入数',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '电话应答数',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '应答率',
        dataIndex: 'op',
        key: 'op'
      }
    ]
  }

  componentDidMount() {}

  // 分页
  handlePageChange = pageNumber => {
    this.setState({
      current: pageNumber
    })
  }

  render() {
    const { data, current } = this.state
    return (
      <Fragment>
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
      </Fragment>
    )
  }
}

export default TableComponent
