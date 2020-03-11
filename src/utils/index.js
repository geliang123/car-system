import { forEach, filter } from 'lodash'

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
export const getTabs = (num, lang, type) => {
  const numFormat = format => {
    const list = [
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
      '十六',
      '十七',
      '十八',
      '十九',
      '二十',
      '二十一',
      '二十二',
      '二十四',
      '二十五',
      '二十六',
      '二十七',
      '二十八'
    ]
    const m = parseInt(format)
    return list[m]
  }
  switch (type) {
    case 'weeks':
      return lang == 'zh_CN' ? `第${numFormat(num)}周` : `week ${num}`
    case 'lol':
      return lang == 'zh_CN' ? `第${numFormat(num)}场` : `Game ${num}`
    case 'lol1':
      return lang == 'zh_CN' ? `第${num}场` : `Game ${num}`
    case 'dota':
      return lang == 'zh_CN' ? `第${numFormat(num)}局` : `Game ${num}`
    case 'round':
      return lang == 'zh_CN' ? `第${numFormat(num)}轮` : `Round ${num}`
    default:
      return ''
  }
}
/*
    时间格式转化
*/
export const getDateFormat = (date, format) => {
  if (!date) return ' '
  const paddNum = function(num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  date = new Date(date * 1000)
  // 指定格式字符
  const cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date
      .getFullYear()
      .toString()
      .substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
    hh: paddNum(date.getHours()), // 时
    mm: paddNum(date.getMinutes()), // 分
    ss: paddNum(date.getSeconds()) // 秒
  }
  format || (format = 'yyyy-MM-dd hh:mm')
  return format.replace(/([a-z])(\1)*/gi, m => cfg[m])
}
export const onErrorImg = (img, type) => {
  if (type && type == 'gif') {
    img.target.src = 'https://resource-sec.vpgame.com/img/gif-default.png'
  } else {
    img.target.src =
      'https://resource-sec.vpgame.com/project/das/static/common/images/default.png'
  }
}
export const geType = type => {
  switch (type) {
    case 'all':
      return '全部'
    case 'dota':
      return 'DOTA2'
    case 'dota2':
      return 'DOTA2'
    case 'lol':
      return 'LOL'
    case 'csgo':
      return 'CSGO'
    case 'cs':
      return 'CSGO'
    case 'pubg':
      return 'PUBG'
    case 'ow':
      return 'OW'
    default:
      return type
  }
}
export const gioTrack = (trackId, params) => {
  params.Game_type = geType(params.Game_type)

  if (window.gio) {
    // console.log(trackId,params)
    gio('track', trackId, {
      VPSource: getCookie('VPSource') || 'web',
      VPLang: getCookie('VPLang') || 'zh_CN',
      ...params
    })
    gio('send')
  }
}
export const toDou = n => {
  if (n < 10) {
    return `0${n}`
  }
  return n.toString()
}
// 对阵时间
export const HourFormat = (leftTime, noHours, dou) => {
  const isMinus = ''
  if (leftTime == 0) return '00:00'
  if (leftTime < 0) {
    return '--'
  }
  // eslint-disable-next-line no-param-reassign
  leftTime *= 1000
  // let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
  let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10) // 计算剩余的小时
  let minutes = parseInt((leftTime / 1000 / 60) % 60, 10) // 计算剩余的分钟
  let seconds = parseInt((leftTime / 1000) % 60, 10) // 计算剩余的秒数
  // days = days > 0 ? `${days}` : ''
  if (noHours) {
    minutes = toDou(hours * 60 + minutes)
    hours = ''
  } else {
    hours = toDou(hours)
    minutes = toDou(minutes)
  }
  seconds = toDou(seconds)
  if (dou) {
    if (!minutes || !seconds) {
      return false
    }
    if (parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
      return '00:00'
    }
    return `${isMinus}${hours}${minutes}:${seconds}`
  }
  return `${isMinus}${hours}${minutes}${seconds}`
}
// 保留小数
export const tofixed = (value, type) => {
  if (!value || !Number(value.toFixed(3)) || Number(value) < 0) {
    const num = type ? '0.0' : 0
    return num
  }
  if (value == 100) return 100
  return value.toFixed(3)
}
export const leftTimer = (leftTime, noHours, dou) => {
  leftTime *= 1000
  let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
  let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10) // 计算剩余的小时
  let minutes = parseInt((leftTime / 1000 / 60) % 60, 10) // 计算剩余的分钟
  let seconds = parseInt((leftTime / 1000) % 60, 10) // 计算剩余的秒数
  // days = days > 0 ? `${days}${getLanguage('DAYS','天')} ` : ''
  days = ''
  if (noHours) {
    minutes = toDou(hours * 60 + minutes)
    hours = ''
  } else {
    hours = toDou(hours)
    minutes = toDou(minutes)
  }
  seconds = toDou(seconds)
  if (dou) {
    if (dou == 'zh_CN' || dou == 'en_US') {
      return dou == 'zh_CN'
        ? `${minutes}分${seconds}秒`
        : `${minutes}:${seconds}`
    }
    return `${days}${hours}${minutes}:${seconds}`
  }
  return `${days}${hours}:${minutes}:${seconds}`
}
export const operateData = (preData, obj) => {
  const list1 = []
  forEach(preData.team1_summary, (v, k) => {
    if (v.team1.id != obj.id) {
      list1.push({
        schedule_name: v.schedule_name,
        schedule_name_en: v.schedule_name_en,
        fb: v.fb,
        fk: v.fk,
        fk_record: {
          score1: v.fk_record.score2,
          score2: v.fk_record.score1
        },
        team1: v.team2,
        team2: v.team1,
        win: v.win,
        duration: v.duration,
        score: [v.score[1], v.score[0]],
        game_time: v.game_time,
        link_uid: v.link_uid
      })
    } else {
      list1.push(v)
    }
  })
  const list2 = []
  forEach(preData.team2_summary, (v, k) => {
    if (v.team1.id != obj.id) {
      list2.push({
        schedule_name: v.schedule_name,
        schedule_name_en: v.schedule_name_en,
        fb: v.fb,
        fk: v.fk,
        fk_record: {
          score1: v.fk_record.score2,
          score2: v.fk_record.score1
        },
        team1: v.team2,
        team2: v.team1,
        win: v.win,
        duration: v.duration,
        score: [v.score[1], v.score[0]],
        game_time: v.game_time,
        link_uid: v.link_uid
      })
    } else {
      list2.push(v)
    }
  })
  return {
    team1_summary: list1,
    team2_summary: list2,
    team1_power: preData.team1_power.slice(0, 10),
    team2_power: preData.team2_power.slice(0, 10)
  }
}
export const getPlayer = (list, id) => {
  const item = list.length ? filter(list, { id }) : []
  if (!item.length) return '1'
  return `${item[0].avatar}?x-oss-process=image/resize,m_fill,h_49,w_49`
}
export const getQueryString = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
export const scrollLocation = (element2, set) => {
  // if (!document.querySelector(element)) return
  // if (!document.querySelector(element2)) return
  // const isFirst = document.querySelector(element).getBoundingClientRect()
  // // 中心距顶部的距离
  // let offsetTop = isFirst.top
  // if (element !== '#isFirst') offsetTop -= 220
  document.querySelector(element2).scrollTo(0, set)
}
export const filterData = (id, data) => {
  if (!data || (!data.length && !id)) return ''
  const item = data.filter(v => v.link_uid === id)
  if (item.length) return item[0]
}
export const filterIndex = (id, data) => {
  if (!data || (!data.length && !id)) return ''
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i].link_uid === id) {
      return i
    }
  }
  return 0
}

export const getUrlParam = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
