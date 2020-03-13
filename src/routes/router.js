import loadable from '@loadable/component'
// 登陆
const Login = loadable(() => import('../container/Login/index'))
const Account = loadable(() => import('../container/Home/Account'))
const EventRecord = loadable(() => import('../container/Home/EventRecord'))
const EventRecordDetail = loadable(() =>
  import('../container/Home/EventRecord/Detail')
)
export default [
  {
    path: ['/', '/login'],
    exact: true,
    component: Login
  },
  {
    path: ['/account'],
    component: Account
  },
  {
    path: ['/eventRecord'],
    component: EventRecord
  },
  {
    path: ['/detail'],
    component: EventRecordDetail
  }
  // {
  //   path: ['/CSGO/schedule/:id'],
  //   exact: true,
  //   component: CSGOSchedule
  // },
  // {
  //   path: ['/CSGO/ranklist/:id'],
  //   exact: true,
  //   component: CSGORankList
  // },
  // {
  //   path: ['/OW001Schedule'],
  //   exact: true,
  //   component: OW001Schedule
  // },
]
