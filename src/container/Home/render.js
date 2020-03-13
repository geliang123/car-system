import React from 'react'
import ReactDOM from 'react-dom'
import App from './index'

const app = document.getElementById('app')

const render = Component => {
  ReactDOM.render(<Component />, app)
}

render(App)
