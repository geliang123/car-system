const url = `${process.env.API_URL}`
const websocket_url = `${process.env.API_WEBSOCKET_URL}`
const urlCng = {
  login: `${url}/login`,
  logout: `${url}/logout`,
  // 菜单
  menu: `${url}/menu/getData`,
  logData: `${url}/data/logData`,
  // 停车场位置
  parkList: `${url}/park/list`,
  // 账户管理
  accountAdd: `${url}/sysUser/addOrUpdate`,
  accountDel: `${url}/sysUser/delete`,
  accountList: `${url}/sysUser/list`,
  accountEdit: `${url}/sysUser/update`,
  // 实时呼叫
  callUpdate: `${url}/callLog/update`,
  callList: `${url}/callLog/list`,
  callDetail: `${url}/callLog/detail`,
  callDel: `${url}/callLog/delete`,
  callProblem: `${url}/callLog/callProblemType`,
  callWaitList: `${url}/callLog/waitList`,
  callSoundAccount: `${url}/acquire/sound/account`,
  eventList: `${url}/equipment/list`,
  // 数据报表
  serviceData: `${url}/data/serviceData`,
  todayData: `${url}/data/todayData`,
  // status
  changeStatus: `${url}/sysUser/changeStatus`,
  // 打开
  open: `${url}/cloudSeat/openBarrier`,
  // search
  searchCar: `${url}/cloudSeat/search`,
  updateCarNum: `${url}/cloudSeat/updateCarNum`,
  // 设备
  equipList: `${url}/equipment/list`,
  equipAdd: `${url}/equipment/addOrUpdate`,
  equipDel: `${url}/equipment/delete`,
  // 新建车场
  parkAdd: `${url}/equipment/`,
  // 任务分配websocket
  taskDispatch: `${websocket_url}/task/dispatch/`,
  audioUrl: `${url}/equipment/selectList`
}
export default urlCng
