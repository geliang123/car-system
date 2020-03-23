import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { hot } from 'react-hot-loader/root'

const defaultData = {
  infeed: {
    data: [1, 2, 3, 4, 5, 7],
    xAxis: ['1:00', '2:00', '3:00', '4:00', '5:00'],
    displayName: '今日进线量',
    unit: '人数'
  },
  answer: {
    data: [1, 2, 3, 4, 5, 7],
    xAxis: ['0:00', '2:00', '3:00', '4:00', '5:00'],
    displayName: '接听量',
    unit: '人数'
  },
  consultion: {
    data: [1, 2, 3, 4, 5, 7],
    xAxis: ['6:00', '2:00', '3:00', '4:00', '5:00'],
    displayName: '已咨询人数',
    unit: '人数'
  },
  queueNumber: {
    data: [1, 2, 3, 4, 5, 7],
    xAxis: ['1:00', '2:00', '3:00', '4:00', '5:00'],
    displayName: '当前排队人数',
    unit: '人数'
  },
  giveupNumber: {
    data: [1, 2, 3, 4, 5, 7],
    xAxis: ['1:00', '2:00', '3:00', '4:00', '5:00'],
    displayName: '今日放弃量',
    unit: '人数'
  }
}
@hot
class ChartComponent extends Component {
  formatOption = data => ({
    title: {
      text: '', // data.displayName,
      textStyle: {
        color: '#999999'
      },
      top: 'auto'
    },
    grid: {
      left: 60,
      right: 40
    },
    color: '#397BEC',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: data.displayName,
      y: 'bottom'
    },
    xAxis: [
      {
        type: 'category',
        data: data.xaxis,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999999',
          fontFamily:
            ' "PingFang SC","微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: data.unit,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999999',
          fontFamily:
            '"PingFang SC", "微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14
        },
        nameTextStyle: {
          color: '#999999',
          fontFamily:
            '"PingFang SC", "微软雅黑","Microsoft YaHei", "Source Sans Pro", Arial',
          fontSize: 14
        },
        // 网格线
        splitLine: {
          lineStyle: {
            color: '#D0D0D0',
            width: 0.4
          }
        }
      }
    ],
    series: [
      {
        name: data.displayName,
        symbol: 'none',
        data: data.hours,
        type: 'line',
        color: '#FFBA01'
      }
    ]
  })

  getArr = data => {
    const arr = []
    for (const key in data) {
      arr.push(data[key])
    }
    return arr
  }

  render() {
    const { data, allData } = this.props
    if (!Object.keys(allData).length || !data || !Object.keys(data).length) {
      return null
    }
    const option = this.formatOption(data)
    const dataAll = this.getArr(allData)
    return (
      <div className="chart-content">
        <ReactEcharts
          option={option}
          notMerge
          style={{ width: '100%', height: '366pt' }}
          className="chart-style"
        />

        <div className="chart-info">
          {dataAll.map((item, index) => (
            <div className="info-item" key={index}>
              <div>{item.displayName}</div>
              <div>{item.xaxisSum}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default ChartComponent
