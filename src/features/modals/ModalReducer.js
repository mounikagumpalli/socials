import { createReducer } from '../../app/common/util/reducerUtils'
import { OPEN_MODAL, CLOSE_MODAL } from './modalConstants'

const initialState = null;

 const openModal = (state,payload) => {
     const {modalType,modalProps} = payload
    return ( {modalType,modalProps})
}

const closeModal = (state) => {
    return null;
} 


export default createReducer(initialState , {
    [OPEN_MODAL] : openModal,
    [CLOSE_MODAL] : closeModal
} )