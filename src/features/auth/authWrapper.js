import {connectedReduxRedirect} from 'redux-auth-wrapper/history4/redirect'
import {openModal} from '../modals/modalActions'

export const UserIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName : 'UserIsAuthenticated',
    allowRedirectBack : true,
    redirectPath : '/events/',
    //this is already connected to reducer, hence we can use auth
    authenticatedSelector : ({firebase:{auth}})=>
            auth.isLoaded && !auth.isEmpty,
    redirectAction : newLoc => (dispatch) => {
        dispatch(openModal('UnauthModal'))
    }
        
})