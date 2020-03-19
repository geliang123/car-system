import axios from 'axios'
import { getLocalStore } from '~/utils/index'

const fetch = ({ url, params, method = 'GET', data }) => {
  const options = {
    url,
    method,
    params,
    data,
    timeout: 10000,
    withCredentials: false,
    headers: { token: getLocalStore('token') } // 设置header
  }
  if (method === 'GET') {
    options.params = {
      ...options.params
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
