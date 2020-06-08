// eslint-disable-next-line import/prefer-default-export
export const getDropType = [
  {
    id: 'answer',
    name: '接听量'
  },
  {
    id: 'reject',
    name: '挂断量'
  },
  {
    id: 'inFeed',
    name: '进线量'
  },
  {
    id: 'wait',
    name: '排队人数'
  },
]

export const dropDataTime = [{
  id: -1,
  name: '全部'
}, {
  id: 1,
  name: '今天'
}, {
  id: 2,
  name: '昨天'
}, {
  id: 3,
  name: '本周'
}, {
  id: 4,
  name: '本月'
}, {
  id: 0,
  name: '自定义'
}]
export const dropAll = [{
  id: 'all',
  name: '全部'
}]

export const dropChartFilter = [{
  id: 'login',
  name: '总登陆时长'
}, {
  id: 'callTime',
  name: '总通话时长'
}, {
  id: 'callIn',
  name: '电话呼入数'
}, {
  id: 'callEd',
  name: '电话应答数'
}, {
  id: 'rate',
  name: '应答率'
}]
