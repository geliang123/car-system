import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import './style.less'
import { withRouter } from 'react-router'

@hot
@withRouter
class Title extends Component {
  componentDidMount() {}

  goback = () => {
    this.props.history.goBack()
  }

  render() {
    const { title } = this.props
    return (
      <div className="top-go">
        <span className="go" onClick={this.goback} />
        <span className="detail-title">{title}</span>
      </div>
    )
  }
}

export default Title
