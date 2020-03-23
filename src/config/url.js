const url = `${process.env.API_URL}`
const urlCng = {
  login: `${url}/login`,
  logout: `${url}/logout`,
  // 菜单
  menu: `${url}/menu/getData`,
  logData: `${url}/data/logData`,
  // 停车场位置
  parkList: `${url}/park/list`,
  // 账户管理
  accountAdd: `${url}/sysUser/addOrUpdate
  `,
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

  // 数据报表
  serviceData: `${url}/data/serviceData`,
  todayData: `${url}/data/todayData`,
  // status
  changeStatus: `${url}/sysUser/changeStatus`
}
export default urlCng
