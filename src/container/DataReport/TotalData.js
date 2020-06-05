/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { Component, Fragment } from 'react'
import { hot } from 'react-hot-loader/root'
import { message, DatePicker, LocaleProvider, Button } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import ChartTable from './ChartTable'
import SelectMenu from '~/component/SelectMenu'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import { dropDataTime, dropChartFilter, dropAll } from './dropData'
import 'moment/locale/zh-cn'
import { getUrl } from '~/utils/index'
import TableComponent from './TableComponent'


import './totalData.less'

const { RangePicker } = DatePicker
const pageSize = 10
@hot
class TotalData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'all', // 下拉
      dateType: 1,
      isDefault: false,
      tableData: [],
      total: 0, // 总数
      current: 1, // 当前页数
      isChart: false,
      chartData: {},
      dropData: dropAll
    }
  }

  componentDidMount() {
    this.getTableData()
  }

 // 下拉改变
 dropChange = (e, key) => {
   this.setState({
     [key]: e
   })
   const { isChart } = this.state
   if (key === 'dateType') {
     if (e === 0) {
       this.setState({
         isDefault: true
       })
     } else {
       this.setState({
         isDefault: false
       }, () => {
         if (isChart) {
           this.getChartData()
         } else {
           this.getTableData()
         }
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

// 获取表格数据
getTableData = () => {
  const { current, dateType } = this.state // &userName=${searchContent}
  let params = {}
  if (dateType === 0) {
    params = {
      startDate: this.startDate,
      endDate: this.endDate,
      timeType: dateType,
      pageSize,
      curPage: current,
    }
  } else {
    params = {
      pageSize,
      curPage: current,
      timeType: dateType
    }
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
  let params = {}
  const { dateType } = this.state
  if (dateType === 0) {
    params = {
      startDate: this.startDate,
      endDate: this.endDate,
      timeType: dateType
    }
  } else {
    params = {
      timeType: dateType
    }
  }
  const url = getUrl(params, `${urlCng.serviceDataReport}`)
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
    const { isChart } = this.state
    const day = moment(dateStrings[1]).diff(moment(dateStrings[0]), 'day')
    if (day + 1 > 30) {
      message.warning('最多只能选择30天')
    } else if (isChart) {
      this.getChartData()
    } else {
      this.getTableData()
    }
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

  change = key => {
    this.setState({
      isChart: key,
      dropData: key ? dropChartFilter : dropAll,
      type: key ? 'login' : 'all'
    })
    if (key) {
      this.getChartData()
    } else {
      this.getTableData()
    }
  }

  render() {
    const { tableData, total, current, type, dateType, isDefault, isChart, chartData, dropData } = this.state
    const dataTable = {
      tableData,
      total,
      pageSize,
      current
    }
    return (
      <Fragment>
        <div className="wrap-top" id="totalData">
          <SelectMenu
            data={dropData}
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
           {
             isChart ? <Button className="btn-change" onClick={() => this.change(false)}>表格统计</Button>
               : <Button className="btn-change" onClick={() => this.change(true)}>图形统计</Button>
           }
        </div>
        <div className="chart-content">
         {
           !isChart ? <TableComponent
             data={dataTable}
             handlePageChange={this.handlePageChange}
           /> : <ChartTable chartData={chartData} type={type} />
         }
        </div>
      </Fragment>
    )
  }
}

export default TotalData
