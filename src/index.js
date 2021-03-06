import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './routes/index'
// import configureStore from './redux/store'

const app = document.getElementById('app')

const render = Component => {
  ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    app
  )
}

render(App)
