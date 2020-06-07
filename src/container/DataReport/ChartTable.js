
import React, { Component, Fragment } from 'react'
import ReactEcharts from 'echarts-for-react'
import { hot } from 'react-hot-loader/root'

@hot
class ChartTable extends Component {
  formatOption = data => ({
    title: {
      text: '', // data.displayName,
      textStyle: {
        color: '#999999',
      },
      top: 'auto',
    },
    dataZoom: [{
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      left: '9%',
      bottom: -5,
      start: 0,
      end: 90 // 初始化滚动条
    }],
    grid: {
      left: 100,
      right: 40,
    },
    color: '#397BEC',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: data.displayName,
      y: 'bottom',
    },
    xAxis: [
      {
        type: 'category',
        data: data.hours,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
          fontFamily:
            ' "PingFang SC","微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14,
          interval: 0,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: data.unit,
        min: 0,
        minInterval: 1,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
          fontFamily:
            '"PingFang SC", "微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14,
        },
        nameTextStyle: {
          color: '#999999',
          fontFamily:
            '"PingFang SC", "微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14,
        },
        // 网格线
        splitLine: {
          lineStyle: {
            color: '#D0D0D0',
            width: 0.4,
          },
        },
      },
    ],
    series: [
      {
        name: data.displayName,
        symbol: 'none',
        data: data.xaxis,
        type: 'bar',
        color: '#FF9640 ',
        barMaxWidth: 30
      },
    ],
  })

  render() {
    const { chartData, type } = this.props
    const data = chartData[type]
    if (!chartData || !data || !Object.keys(data).length || !data || !Object.keys(data).length) {
      return null
    }
    const option = this.formatOption(data)
    return (
      <Fragment>
        <div className="chart-content">
          <ReactEcharts
            option={option}
            notMerge
            style={{ width: '100%', height: '366pt' }}
            className="chart-style"
          />
        </div>
      </Fragment>
    )
  }
}

export default ChartTable
