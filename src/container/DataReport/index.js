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
import SelectMenu from '~/component/SelectMenu'

const pageSize = 10
const dropData = [
  {
    id: 'wait',
    name: '当前排队人数'
  },
  {
    id: 'answer',
    name: '今日接听量'
  },
  {
    id: 'reject',
    name: '今日放弃数'
  },
  {
    id: 'inFeed',
    name: '今日进线量'
  }
]
@hot
@withRouter
class DataReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'chart',
      tableData: [],
      chartData: {},
      total: 0, // 总数
      current: 1, // 当前页数
      type: 'wait' // 下拉
    }
  }

  componentDidMount() {
    this.getTableData()
    this.getChartData()
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

  // 获取图表数据
  getChartData = () => {
    const url = `${urlCng.todayData}`
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          chartData: res.result
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  // 下拉改变
  dropChange = (e, key) => {
    this.setState({
      [key]: e
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
    const { active, tableData, total, chartData, type, current } = this.state
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
            {active === 'table' ? null : (
              <SelectMenu
                data={dropData}
                change={e => this.dropChange(e, 'type')}
                defaultValue={type}
                style={{ marginRight: '30pt', width: '200px' }}
              />
            )}
          </div>
          {/* 表格数据 */}
          {active === 'table' ? (
            <TableComponent
              data={dataTable}
              handlePageChange={this.handlePageChange}
            />
          ) : (
            <ChartComponent data={chartData[type]} allData={chartData} />
          )}
        </div>
      </div>
    )
  }
}

export default DataReport
