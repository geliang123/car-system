import loadable from '@loadable/component'
// 登陆
const Login = loadable(() => import('../container/Login/index'))
const LiveCall = loadable(() => import('../container/LiveCall'))
const Account = loadable(() => import('../container/Account'))
const EventRecord = loadable(() => import('../container/EventRecord'))
const EventRecordDetail = loadable(() =>
  import('../container/EventRecord/Detail')
)
const LiveCallDetail = loadable(() =>
  import('../container/Livecall/LivecallDeatil')
)
const DataReport = loadable(() => import('../container/DataReport'))
const EquipmentCheck = loadable(() => import('../container/EquipmentCheck'))
const CarManage = loadable(() => import('../container/CarManage'))
export default [
  {
    path: ['/', '/login'],
    exact: true,
    component: Login
  },
  {
    path: ['/call_now'],
    component: LiveCall
  },
  {
    path: ['/account'],
    component: Account
  },
  {
    path: ['/event'],
    component: EventRecord
  },
  {
    path: ['/detail'],
    component: EventRecordDetail
  },
  {
    path: ['/livedetail'],
    component: LiveCallDetail
  },
  {
    path: ['/report'],
    component: DataReport
  },
  {
    path: ['/equipmentCheck'],
    component: EquipmentCheck
  },
  {
    path: ['/car'],
    component: CarManage
  }
]
