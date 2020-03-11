import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import '../../less/normal.less'
import './style.less'
import LeagueData from './LeagueData'

@hot
class LckLeagueData extends Component {
  state = {}

  componentDidMount() {}

  render() {
    return (
      <div className="LckLeagueData" id="LckLeagueData">
        <LeagueData />
        <a id="live-link" onClick={this.goWatchGame} target="_blank">
          <i />
          <span>来VPGAME领取星穹宝箱，送黑夜使者李青</span>
          <img src={require('../../images/common/vp.png')} alt="vp" />
        </a>
      </div>
    )
  }
}

export default LckLeagueData
