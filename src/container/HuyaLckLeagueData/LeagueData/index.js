import React, { Component } from 'react'
import Players from './Players'
import Teams from './Teams'
import fetch from '~/utils/fetch'
import './style.less'

// 处理数据
const setData = (data, type) => {
  const newData = []
  data.forEach(item => {
    let obj = item[type]
    obj = Object.assign(item.values, obj)
    newData.push(obj)
  })
  return newData
}

const league = process.env.LEAGUE
const env = process.env.NODE_ENV == 'development' ? '/pre' : ''
const league_id = process.env.NODE_ENV == 'development' ? '32' : '48'

class LeagueData extends Component {
  state = {
    loading: true,
    activeTab: 'player',
    teamData: [],
    playeData: []
  }

  componentDidMount() {
    this.getPlayer()
    this.getTeams()
  }

  changeTab = activeTab => {
    this.setState({
      activeTab
    })
  }

  getPlayer = () => {
    fetch({
      url: `${league}/data/lol/league-stats/league/${league_id}/bg-stats${env}/players.json`
    }).then(res => {
      this.setState({
        loading: false
      })
      if (!res || !res.data || !res.data.length) return
      this.setState({
        playeData: setData(res.data, 'player')
      })
    })
  }

  getTeams = () => {
    fetch({
      url: `${league}/data/lol/league-stats/league/${league_id}/bg-stats${env}/teams.json`
    }).then(res => {
      if (!res || !res.data || !res.data.length) return
      this.setState({ teamData: setData(res.data, 'team') })
    })
  }

  render() {
    const { teamData, activeTab, playeData, loading } = this.state
    return (
      <div className="lckLeagueData">
        <div className="rankTabs">
          <div
            className={`${activeTab == 'player' && 'active'} rankTab`}
            onClick={() => {
              this.changeTab('player')
            }}
          >
            选手排行
          </div>
          <div
            className={`${activeTab == 'team' && 'active'} rankTab`}
            onClick={() => {
              this.changeTab('team')
            }}
          >
            战队排行
          </div>
        </div>
        {!loading && (
          <React.Fragment>
            {activeTab == 'player' && <Players data={playeData} />}
            {activeTab == 'team' && <Teams data={teamData} />}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default LeagueData
