import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import TableComponent from './TableComponent'
import ChartComponent from './ChartComponent'
import '../../less/normal.less'
import './style.less'
import defaultData from '../Account/data.json'

@hot
@withRouter
class DataReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'table'
    }
  }

  componentDidMount() {}

  changeTab = key => {
    this.setState({
      active: key
    })
  }

  render() {
    const { active } = this.state
    return (
      <div className="panel">
        <div id="dataReport">
          <div className="wrap-switch">
            <div
              className={`btn-switch ${active === 'table' ? 'active' : null}`}
              onClick={() => this.changeTab('table')}
            >
              当日整体态势
            </div>
            <div
              className={`btn-switch ${active === 'chart' ? 'active' : null}`}
              onClick={() => this.changeTab('chart')}
            >
              坐席统计数据
            </div>
          </div>
          {/* 表格数据 */}
          {active === 'table' ? <TableComponent /> : <ChartComponent />}
        </div>
      </div>
    )
  }
}

export default DataReport
