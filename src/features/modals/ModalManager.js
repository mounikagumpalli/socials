import React from 'react'
import TestModal from './TestModal'
import { connect } from 'react-redux'
import LoginModal from '../modals/LoginModal'
import RegisterModal from '../modals/RegisterModal'
import UnauthModal from './UnauthModal'

const modalLookUp ={
    TestModal,
    LoginModal,
    RegisterModal,
    UnauthModal
}

const mapState = (state) => {
    return {
        currentModal : state.modals
    }
}
    
    


 const ModalManager = ({currentModal}) => {
     let renderModal=''
    if (currentModal){
        const {modalType,modalProps} = currentModal
        const ModalComponent = modalLookUp[modalType]
        renderModal = <ModalComponent {...modalProps} />
    }
    return (
        <span>
            { renderModal}
        </span>
    )
}


export default connect(mapState)(ModalManager)