import React, { Component, Fragment } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import { NavLink , Link , withRouter } from 'react-router-dom'
import { SignedOutMenu } from '../Menus/SignedOutMenu'
import { SignedInMenu } from '../Menus/SignedInMenu'
import { connect } from 'react-redux'
import { openModal } from "../../modals/modalActions"
import { withFirebase } from 'react-redux-firebase'     // HOC providing lot of functionality like logout


const actions = {
  openModal
}

const mapState = (state) => {
    return {
      auth : state.firebase.auth,
      profile : state.firebase.profile
    }

}

class Navbar extends Component {

  

  handleSignOut = () => {
      
      this.props.firebase.logout()
    
    this.props.history.push('/')
  }

  handleSignIn = () => {
    this.props.openModal('LoginModal')

  }

  handleRegister = () => {
    this.props.openModal('RegisterModal')
  }

    render() {
      const {auth ,profile} = this.props;
      const authenticated = auth.isLoaded && !auth.isEmpty;
        return (
                  <Menu inverted fixed="top">
                    <Container>
                      <Menu.Item as={NavLink} to="/" exact header>
                        <img src="/assets/logo.png" alt="logo" />
                        Socials
                      </Menu.Item>
                      <Menu.Item as={NavLink} to="/events" exact name="Events" />
                      {authenticated &&
                        <Fragment>
                      <Menu.Item as={NavLink} to="/people" name="People" />
                      <Menu.Item as={NavLink} to="/test" name="Test" />
                      <Menu.Item>
                        <Button as={Link} to="/createevent" floated="right" positive inverted content="Create Event" />
                      </Menu.Item>
                      </Fragment>}
                      {authenticated ? <SignedInMenu auth={auth} profile={profile} signIn={this.handleSignOut} /> : <SignedOutMenu signOut={this.handleSignIn}  register={this.handleRegister}/> }
                                           
                    </Container>
                  </Menu>
        )
    }
}

export default withRouter(withFirebase(connect(mapState,actions)(Navbar)))
