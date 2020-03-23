/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

export const resizeImg = (url, type, w, h, webp) => {
  const defaultImg =
    'https://resource-sec.vpgame.com/project/das/static/common/images/default.png'
  url = String(url)

  if (url != 'undefined' && url && url.indexOf('svg') > -1) {
    return url
  }
  if (url != 'undefined' && url && url.indexOf('unknown') > -1) {
    return defaultImg
  }
  if (url != 'undefined' && url && url.indexOf('.svg') == -1) {
    switch (type) {
      case 1:
        return `${url}?x-oss-process=image/resize,m_lfit,h_${h},w_${w},limit_0${
          webp ? '/format,webp' : ''
        }`
      case 2:
        return `${url}?x-oss-process=image/crop,x_0,y_75,h_${h},w_${w},limit_0${
          webp ? '/format,webp' : ''
        }`
      case 3:
        return `${url}?x-oss-process=image/crop,w_${w},h_${h},g_center`
      default:
        return url
    }
  } else {
    return defaultImg
  }
}

export const getQueryString = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
export const getColor = duration => {
  if (duration <= 60) {
    return '#3CEA43'
  }
  if (duration >= 60 && duration <= 120) {
    return '#EAB43C'
  }
  return '#EA3C3C'
}
export const getUrl = (params, url) => {
  const arr = []
  for (const key in params) {
    arr.push(`${key}=${params[key]}`)
  }
  return `${url}?${arr.join('&')}`
}
/**
 * 获取localStorage
 */
export const getLocalStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}
/**
 * 存储localStorage
 */
export const setLocalStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const getStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/**
 * 删除sessionStorage
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}
/**
 * 删除sessionStorage全部
 */
export const removeAllStore = () => {
  window.sessionStorage.clear()
}
