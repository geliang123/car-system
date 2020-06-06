import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router-dom'
import TotalData from './TotalData'
import ChartComponent from './ChartComponent'
import '../../less/normal.less'
import './style.less'

@hot
@withRouter
class DataReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'chart',
    }
  }

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
            <div>
              <TotalData />
            </div>
          ) : (
            <ChartComponent />
          )}
        </div>
      </div>
    )
  }
}

export default DataReport
