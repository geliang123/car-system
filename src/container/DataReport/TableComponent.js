import React, { Component, Fragment } from 'react'
import { Table } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import './style.less'

@hot
class TableComponent extends Component {
  constructor(props) {
    super(props)

    this.headers = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id
      },
      {
        title: '坐席名称',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '当前状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '总登录时长',
        dataIndex: 'loginCountSeconds',
        key: 'loginCountSeconds',
        sorter: (a, b) => a.loginCountSeconds - b.loginCountSeconds
      },
      {
        title: '总通话时长',
        dataIndex: 'callCountSeconds',
        key: 'callCountSeconds',
        sorter: (a, b) => a.callCountSeconds - b.callCountSeconds
      },
      {
        title: '电话呼入数',
        dataIndex: 'callInCount',
        key: 'callInCount',
        sorter: (a, b) => a.callInCount - b.callInCount
      },
      {
        title: '电话应答数',
        dataIndex: 'callEdCount',
        key: 'callEdCount',
        sorter: (a, b) => a.callEdCount - b.callEdCount
      },
      {
        title: '应答率',
        dataIndex: 'callRate',
        key: 'callRate',
        sorter: (a, b) => a.callRate - b.callRate
      }
    ]
  }

  render() {
    const { data } = this.props
    return (
      <Fragment>
        {/* 表格数据 */}
        <Table
          dataSource={data.tableData}
          columns={this.headers}
          rowKey={(record, index) => index}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            total: data.total,
            pageSize: data.pageSize,
            current: data.current,
            onChange: this.props.handlePageChange
          }}
        />
        <div className="total">
          共{data.total}条记录{' '}
          <span className="page-num">每页{data.pageSize}条</span>
        </div>
      </Fragment>
    )
  }
}

export default TableComponent
