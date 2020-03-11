import React, { Component } from 'react'
import { findIndex, forEach, orderBy } from 'lodash'
import FreeScrollBar from 'react-free-scrollbar'
import NoData from '@/NoData'
import { onErrorImg } from '~/utils'

const tofixed = (value, type) => {
  if (!value || !Number(value.toFixed(1)) || Number(value) < 0) {
    const num = type ? '0.0' : 0
    return num
  }
  if (value == 100) return 100
  return value.toFixed(1)
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        {
          val: '比赛场次',
          type: 'matches_count',
          active: 'activeBootom',
          point: '比赛场次'
        },
        {
          val: '胜率',
          type: 'win_rate',
          active: '',
          point: '胜率'
        },
        {
          val: '总击杀',
          type: 'total_kills',
          active: '',
          point: '总击杀'
        },
        {
          val: '场均击杀',
          type: 'kills',
          active: '',
          point: '场均击杀'
        },
        {
          val: '总死亡',
          type: 'total_deaths',
          active: '',
          point: '总死亡'
        },
        {
          val: '场均死亡',
          type: 'deaths',
          active: '',
          point: '场均死亡'
        },
        {
          val: '场均补刀',
          type: 'creep_score',
          active: '',
          point: '场均补刀'
        },
        {
          val: '场均KDA',
          type: 'kda',
          active: '',
          point: '场均KDA'
        }
      ],
      list: [],
      type: 'matches_count'
    }
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      list: orderBy(
        nextProps.data,
        ['matches_count', 'matches_count'],
        ['desc', 'desc']
      )
    })
  }

  componentDidMount = () => {
    this.setState({
      list: orderBy(
        this.props.data,
        ['matches_count', 'matches_count'],
        ['desc', 'desc']
      )
    })
  }

  changTabs = item => {
    const { tabs } = this.state
    let list = []
    const index = findIndex(this.state.tabs, e => e.type == item.type)
    if (item.active) {
      tabs[index].active =
        item.active == 'activeBootom' ? 'activeTop' : 'activeBootom'
      list =
        item.active == 'activeBootom'
          ? orderBy(
            this.props.data,
            [item.type, 'matches_count'],
            ['desc', 'desc']
          )
          : orderBy(
            this.props.data,
            [item.type, 'matches_count'],
            ['asc', 'desc']
          )
    } else {
      forEach(tabs, (v, k) => {
        v.active = ''
      })
      tabs[index].active = 'activeBootom'
      list = orderBy(
        this.props.data,
        [item.type, 'matches_count'],
        ['desc', 'desc']
      )
    }
    this.setState({
      tabs,
      list,
      type: item.type
    })
  }

  render() {
    const { type, list, tabs } = this.state
    const { data } = this.props
    return (
      <div className="rankContainer">
        <ul className="title">
          <li>排名</li>
          <li>选手</li>
          {tabs.map((v, k) => (
            <li
              className={v.active}
              key={k}
              onClick={() => {
                this.changTabs(v)
              }}
            >
              {v.val}
              <span>
                <i />
                <i />
              </span>
            </li>
          ))}
        </ul>
        {list.length ? (
          <div className="rankLists">
            <FreeScrollBar className="items" key="playerList">
              {this.state.list.map((v, k) => (
                <ul className={`item ${type}`} key={k}>
                  <li>{k + 1}</li>
                  <li>
                    <span>
                      <img
                        src={v.logo}
                        alt={v.abbr}
                        onError={e => {
                          onErrorImg(e)
                        }}
                      />
                    </span>
                    <span>{v.abbr}</span>
                  </li>
                  <li>{v.matches_count}</li>
                  <li>{`${tofixed(v.win_rate * 100)}%`}</li>
                  <li>{v.total_kills}</li>
                  <li>{tofixed(v.kills)}</li>
                  <li>{v.total_deaths}</li>
                  <li>{tofixed(v.deaths)}</li>
                  <li>{tofixed(v.creep_score)}</li>
                  <li>{tofixed(v.kda)}</li>
                </ul>
              ))}
            </FreeScrollBar>
          </div>
        ) : (
          ''
        )}

        {data.length == 0 && <NoData />}
      </div>
    )
  }
}

export default Index
