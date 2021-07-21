import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import CampaignDetails from './pages/CampaignDetails'
import contact from './pages/contact'
import about from './pages/about'
import Working from './pages/Working'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact={true} path="/working" component={Working} />
      <Route exact={true} path="/about" component={about} />
      <Route exact={true} path="/contact" component={contact} />
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/:camp" component={CampaignDetails} />
      
    </Switch>
  </BrowserRouter>,
  document.querySelector('#root')
)
