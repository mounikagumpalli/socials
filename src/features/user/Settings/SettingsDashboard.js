import React from 'react'
import { Grid } from 'semantic-ui-react'
import { SettingsNav } from './SettingsNav'
import { Route , Redirect , Switch } from 'react-router-dom'
import  BasicPage  from './BasicPage'
import  PhotoPage  from './Photos/PhotoPage'
import  AboutPage  from './AboutPage'
import  AccountPage  from './AccountPage'
import { connect } from 'react-redux'
import { updatePassword } from '../../auth/authActions'
import { updateProfile } from '../userActions'
//import {format, toDate } from 'date-fns'

const actions = {
    updatePassword,
    updateProfile
}

const mapState = (state) => ({
    providerId : state.firebase.auth.isLoaded && state.firebase.auth.providerData[0].providerId,
    user : state.firebase.profile
})

 const SettingsDashboard = ({updatePassword , providerId , user , updateProfile }) => {

    return (
        <Grid>
            <Grid.Column width={12}>
                <Switch>
                <Redirect exact path='/settings' to='/settings/basics' />
                <Route path='/settings/basics' render={()=> <BasicPage initialValues={user} updateProfile={updateProfile}/>} />
                <Route path='/settings/aboutMe' render={()=> <AboutPage initialValues={user} updateProfile = {updateProfile} />} />
                <Route path='/settings/myPhotos' component={PhotoPage} />
                <Route path='/settings/myAccount' render={() => <AccountPage updatePassword={updatePassword} providerId={providerId} />} />
                </Switch>
            </Grid.Column>
            <Grid.Column width={4}>
                <SettingsNav />
            </Grid.Column>
        </Grid>
    )
}


export default connect(mapState,actions)(SettingsDashboard)