import { combineReducers } from "redux";
import testReducer from "../../../features/test/testReducer";
import EventReducer from "../../../features/event/EventReducer";
import {reducer as ToastrReducer} from 'react-redux-toastr'
import {reducer as Formreducer} from 'redux-form'
import ModalReducer from "../../../features/modals/ModalReducer";
import AuthReducer from "../../../features/auth/AuthReducer";
import AsyncReducer from "../../../features/async/AsyncReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";



export const rootReducer = combineReducers({
    firebase:firebaseReducer,
    firestore:firestoreReducer,
    form:Formreducer,
    test:testReducer,
    events:EventReducer,
    modals:ModalReducer,
    auth:AuthReducer,
    async:AsyncReducer,
    toastr : ToastrReducer
})