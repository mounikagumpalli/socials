import React , { Fragment } from 'react'
import EventDashboard  from '../../features/event/EventDashboard/EventDashboard'
import  EventDetailed  from '../../features/event/EventDetailed/EventDetailed'
import  PeopleDashboard  from '../../features/user/PeopleDashboard/PeopleDashboard'
import  UserDetailed  from '../../features/user/UserDetailed/UserDetailed'
import  SettingsDashboard  from '../../features/user/Settings/SettingsDashboard'
import { HomePage } from '../../features/home/HomePage'
import Navbar from '../../features/nav/Navbar/Navbar'
import { Container } from 'semantic-ui-react'
import { Route, Switch,withRouter } from 'react-router-dom'
import EventForm from '../../features/event/EventForm/EventForm'
import TestComponent from '../../features/test/TestComponent'
import ModalManager from '../../features/modals/ModalManager'
import { UserIsAuthenticated } from '../../features/auth/authWrapper'
import NotFound from './NotFound'

function App(props) {
  return (
    
    <Fragment>
      <ModalManager /> 
      <Route exact path="/" component={HomePage} /> 
      <Route path="/(.+)" render = {() => (
        <Fragment>
        <Navbar />
        <Container className="main">
         <Switch key={props.location.key}>
         <Route path="/events" exact component={EventDashboard} />
         <Route path="/events/:id" component={EventDetailed} />
         <Route path="/people" component={UserIsAuthenticated(PeopleDashboard)} />
         <Route path="/profile/:id" component={UserIsAuthenticated(UserDetailed)} />
         <Route path="/settings" component={UserIsAuthenticated(SettingsDashboard)} />
         <Route path={["/createevent" , "/manageevent/:id"]} component={UserIsAuthenticated(EventForm)} />
         <Route path="/test" component={TestComponent} />
         <Route component={NotFound} />
         </Switch>
        </Container>  
     </Fragment>
      )} />
    </Fragment>
    
  )
}

export default withRouter(App)
