import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
import TableComponent from './TableComponent'
import ChartComponent from './ChartComponent'
import '../../less/normal.less'
import './style.less'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import { getUrl } from '~/utils/index'

const pageSize = 10
@hot
@withRouter
class DataReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'chart',
      tableData: [],
      total: 0, // 总数
      current: 1, // 当前页数

    }
  }

  componentDidMount() {
    this.getTableData()
  }

  changeTab = key => {
    this.setState({
      active: key
    })
  }

  // 获取表格数据
  getTableData = () => {
    const { current } = this.state // &userName=${searchContent}
    const params = {
      pageSize,
      curPage: current
    }
    const url = getUrl(params, `${urlCng.serviceData}`)

    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          tableData: res.result.data,
          total: res.result.page.totalNum
        })
      } else {
        message.error(res.msg)
      }
    })
  }


  // 分页
  handlePageChange = pageNumber => {
    this.setState(
      {
        current: pageNumber
      },
      () => {
        this.getTableData()
      }
    )
  }

  render() {
    const { active, tableData, total, current } = this.state
    const dataTable = {
      tableData,
      total,
      pageSize,
      current
    }
    return (
      <div className="panel">
        <div id="dataReport">
          <div className="top">
            <div className="wrap-switch">
              <div
                className={`btn-switch ${active === 'chart' ? 'active' : null}`}
                onClick={() => this.changeTab('chart')}
              >
                当日整体态势
              </div>
              <div
                className={`btn-switch ${active === 'table' ? 'active' : null}`}
                onClick={() => this.changeTab('table')}
              >
                坐席统计数据
              </div>
            </div>
          </div>
          {/* 表格数据 */}
          {active === 'table' ? (
            <TableComponent
              data={dataTable}
              handlePageChange={this.handlePageChange}
            />
          ) : (
            <ChartComponent />
          )}
        </div>
      </div>
    )
  }
}

export default DataReport
