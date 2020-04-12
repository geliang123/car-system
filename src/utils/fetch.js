import axios from 'axios'
import { message } from 'antd'
import { getLocalStore } from '~/utils/index'
// respone拦截器 判断登陆失效
axios.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data
    // 过期
    if (res.code === -1) {
      message.error(res.msg)
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      return response
    }
  },
  error => Promise.reject(error)
)
const fetch = ({ url, params, method = 'GET', data }) => {
  const options = {
    url,
    method,
    params,
    data,
    timeout: 10000,
    withCredentials: false,
    headers: { token: getLocalStore('token') }, // 设置header
  }
  if (method === 'GET') {
    options.params = {
      ...options.params,
      //  t: new Date().getTime()
    }
  }
  return axios(options)
    .then(res => res.data)
    .catch(err => {
      console.warn(err)
    })
}

export default fetch
