import { closeModal } from "../modals/modalActions"
import { SubmissionError , reset } from "redux-form"
import { toastr } from 'react-redux-toastr'


export const loginUser = (creds) => {
    return async (dispatch, getState , {getFirebase}) => {
        const firebase = getFirebase();
        try {
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
            dispatch(closeModal())
        }catch(error){
            console.log(error)
            throw new SubmissionError({
                _error:"Login Failed.Invalid ID/Password"            // or error.message for detailed info
            })
        }
        
    }
}

export const registerUser = (user) =>
    async (dispatch , getState , {getFirebase , getFirestore}) => {
        const firebase = getFirebase();
        const firestore  = getFirestore();
        try {
               let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email,user.password);
                console.log(createdUser)
                await createdUser.user.updateProfile({
                    displayName: user.displayName
                })
                let newUser = {
                    displayName: user.displayName,
                    createdAt : firestore.FieldValue.serverTimestamp() 
                };
                await firestore.set(`users/${createdUser.user.uid}` , {...newUser});
                dispatch(closeModal())

        }catch(error){
            console.log(error)
            throw new SubmissionError({
                _error:error.message        
            })
        }
    }

    export const socialLogin = (selectedProvider) => {
        return async(dispatch , getState , {getFirebase,getFirestore}) => {
            const firebase = getFirebase()
            const firestore = getFirestore()
            try{
                dispatch(closeModal())
                let user = await firebase.login({
                    provider : selectedProvider,
                    type : 'popup'                             //can also be redirect
                })
                console.log(user)
                if(user.additionalUserInfo.isNewUser){
                    await firestore.set(`users/${user.user.uid}`,{
                        displayName : user.profile.displayName,
                        photoURL : user.profile.avatarUrl,
                        createdAt : firestore.FieldValue.serverTimestamp()
                    })
                }
                
            }
            catch(error){
                console.log(error)
            }
        }
    
    }

    export const updatePassword = (creds) => 
    async (dispatch , getState , {getFirebase}) => {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        try{
            await user.updatePassword(creds.newPassword1);
            await dispatch(reset('account'))    
            toastr.success('Success' , 'Your password hass been updated successfully')                  //name of the form
        }
        catch(error){
            throw new SubmissionError({
                _error : error.message
            })
        }
    }