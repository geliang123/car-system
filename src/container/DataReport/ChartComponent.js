/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { Component, Fragment } from 'react'
import ReactEcharts from 'echarts-for-react'
import { hot } from 'react-hot-loader/root'
import { message, DatePicker, LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import SelectMenu from '~/component/SelectMenu'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import { getDropType, dropDataTime } from './dropData'
import 'moment/locale/zh-cn'
import { getUrl } from '~/utils/index'

const { RangePicker } = DatePicker
@hot
class ChartComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'wait', // 下拉
      dateType: 1,
      chartData: {},
      isDefault: false
    }
  }

  componentDidMount() {
    this.getChartData()
  }

  formatOption = data => ({
    title: {
      text: '', // data.displayName,
      textStyle: {
        color: '#999999',
      },
      top: 'auto',
    },
    grid: {
      left: 60,
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
        type: 'line',
        color: '#397BEC',
      },
    ],
  })

 // 下拉改变
 dropChange = (e, key) => {
   this.setState({
     [key]: e
   })
   if (key === 'dateType') {
     if (e === 0) {
       this.setState({
         isDefault: true
       })
     } else {
       this.setState({
         isDefault: false
       }, () => {
         this.getChartData()
       })
     }
   }
 }

  getArr = data => {
    const arr = []
    for (const key in data) {
      arr.push(data[key])
    }
    return arr
  }

  // 获取图表数据
  getChartData = () => {
    let params = {}
    const { dateType } = this.state
    if (dateType === 0) {
      params = {
        startDate: this.startDate,
        endDate: this.endDate
      }
    } else {
      params = {
        timeType: dateType
      }
    }
    const url = getUrl(params, `${urlCng.todayData}`)
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

  onChangeDate = (dates, dateStrings) => {
    this.startDate = dateStrings[0]
    this.endDate = dateStrings[1]
    const day = moment(dateStrings[1]).diff(moment(dateStrings[0]), 'day')
    if (day + 1 > 30) {
      message.warning('最多只能选择30天')
    } else {
      this.getChartData()
    }
  }

  render() {
    const { chartData, type, dateType, isDefault } = this.state
    const data = chartData[type]
    if (!chartData || !data || !Object.keys(data).length || !data || !Object.keys(data).length) {
      return null
    }
    const option = this.formatOption(data)
    const dataAll = this.getArr(chartData)
    return (
      <Fragment>
        <div className="wrap-top">
          <SelectMenu
            data={getDropType}
            change={e => this.dropChange(e, 'type')}
            defaultValue={type}
            style={{ margin: '0 30pt', width: '200px' }}
          />
           <SelectMenu
             data={dropDataTime}
             change={e => this.dropChange(e, 'dateType')}
             defaultValue={dateType}
             style={{ marginRight: '30pt', width: '200px' }}
           />
           {
             isDefault ?
              <LocaleProvider locale={zh_CN}>
                  <RangePicker
                    allowClear
                    format="YYYY-MM-DD"
                    onChange={this.onChangeDate}
                    style={{ width: '310px' }}
                    placeholder={['选择起始时间', '选择结束时间']}
                  />
              </LocaleProvider> : null
           }
        </div>
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
      </Fragment>
    )
  }
}

export default ChartComponent
