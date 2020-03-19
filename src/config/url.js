const url = `${process.env.API_URL}`
const urlCng = {
  login: `${url}/login`,
  logout: `${url}/logout`,
  // 账户管理
  accountAdd: `${url}/sysUser/add`,
  accountDel: `${url}/sysUser/delete`,
  accountList: `${url}/sysUser/list`,
  accountEdit: `${url}/sysUser/update`,
  // 实时呼叫
  callUpdate: `${url}/callLog/update`,
  callList: `${url}/callLog/list`,
  callDetail: `${url}/callLog/detail`,
  callDel: `${url}/callLog/delete`
}
export default urlCng
