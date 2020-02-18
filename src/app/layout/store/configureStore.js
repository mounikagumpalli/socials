import { createStore, applyMiddleware } from 'redux'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'  //rRF is an enhancer -adds fb config to store , gFb helps in getting an instance of fb which can be used to dispatch actions
import { reduxFirestore, getFirestore } from 'redux-firestore' //equvi to rRF
import { rootReducer } from '../reducer/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import firebase from '../../config/firebase'

const rrfConfig = {
    userProfile: 'users',       //creates a profile for user added in firebase under "users"
    attachAuthIsReady: true,     //waits till authentication is completed when set to true
    useFirestoreForProfile: true,  //uses firestore when set to true (default is firebase)
    updateProfileOnLogin : false,
    storageBucket: "socials-e539f.appspot.com",
    messagingSenderId: "323637149012"
}

function configureStore() {

    const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];
    const composedEnhancer = composeWithDevTools(
        applyMiddleware(...middlewares),
        reactReduxFirebase(firebase, rrfConfig),
        reduxFirestore(firebase)
    )

    return createStore(rootReducer, composedEnhancer) //devToolsEnhancer() can be replaced with composeWithDevTools when other middlewares have to supplied to thhe store
}

export default configureStore
