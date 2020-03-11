import loadable from '@loadable/component'
// 联赛数据
const HuyaLckLeagueData = loadable(() =>
  import('../container/HuyaLckLeagueData/index')
)
export default [
  {
    path: ['/', '/HuyaLckSchedule'],
    exact: true,
    component: HuyaLckLeagueData
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
