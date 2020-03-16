import loadable from '@loadable/component'
// 登陆
const Login = loadable(() => import('../container/Login/index'))
const LiveCall = loadable(() => import('../container/Home/LiveCall'))
const Account = loadable(() => import('../container/Home/Account'))
const EventRecord = loadable(() => import('../container/Home/EventRecord'))
const EventRecordDetail = loadable(() => import('../container/Home/EventRecord/Detail'))
const LiveCallDetail = loadable(() => import('../container/Home/Livecall/LivecallDeatil'))
export default [
  {
    path: ['/', '/login'],
    exact: true,
    component: Login
  },
  {
    path: ['/liveCall'],
    component: LiveCall
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
  },
  {
    path: ['/livedetail'],
    component: LiveCallDetail
  }
]
