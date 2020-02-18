import { toastr } from "react-redux-toastr";
import { asyncActionStart, asyncActionFinish , asyncActionError } from "../async/asyncActions";
import cuid from 'cuid'
import firebase from '../../app/config/firebase'
import {  FETCH_USER_EVENTS } from "../event/eventConstants";


export const updateProfile=(user)=>
    async(dispatch,getState,{getFirebase})=>{
        const firebase = getFirebase()
        const {isEmpty , isLoaded, ...updatedUser} = user
        try {
                await firebase.updateProfile(updatedUser)    // updates the user in firestore not firebase.auth() #141
                toastr.success('Success','Profile updated successfully')
        }       
        catch (error){
            console.log(error)
        }
    }

    
export const uploadProfileImage= (file , fileName) => 
async (dispatch , getState , {getFirebase , getFirestore}) => {
    const imageName = cuid();
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const path = `${user.uid}/user_images`;
    const options = {
        name:imageName
    }
    try {
        dispatch(asyncActionStart())
            //upload image to Firebase store
            let uploadedFile = await firebase.uploadFile(path , file , null,options)
            //get url of image
            let downloadURL  = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
            //get user doc from firestore
            let userDoc = await firestore.get(`users/${user.uid}`)
            //check if user has profile photo else update the profile
            if(!userDoc.data().photoURL){
                    await firebase.updateProfile({                  //updates in firestore [we are just using the firebase ref on firestore-- thats the way it is]
                        photoURL : downloadURL
                    })
            }
            await user.updateProfile({
                photoURL : downloadURL              // to update directly thhe firebase auth() contents we directly use the "user" object and not the firebase instance
            })
            //add the image to firestore
            await firestore.add({                       //add method is used, the id gets geenratd on its own
                collection : 'users',                          //where to add
                doc : user.uid,
                subcollections : [{collection:'photos'}]
            },{
                name:imageName,                     //fileName prop can be used but when 2 pics with same name are added firestore replaces one with the other . hence giving unique IDs
                url:downloadURL                                    //what to add
            })
            dispatch(asyncActionFinish())
    }catch(error){
        console.log(error)
        dispatch(asyncActionError())
    }
}

export const deletePhoto = (photo) => 
    async (dispatch , getState , {getFirebase ,getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`)
            await firestore.delete({
                collection:'users',
                doc:user.uid,
                subcollections: [{collection:'photos' , doc:photo.id}]
            })
        }catch(error){
            console.log(error)
            throw new Error('Problem deleting the photo')
        }

        
    }


    export const setMainPhoto = photo => async (dispatch, getState) => {
        dispatch(asyncActionStart());
        const firestore = firebase.firestore();
        const user = firebase.auth().currentUser;
        const today = new Date(Date.now());
        let userDocRef = firestore.collection('users').doc(user.uid);
        let eventAttendeeRef = firestore.collection('event_attendee');
        try {
          let batch = firestore.batch();
      
          await batch.update(userDocRef, {
            photoURL: photo.url
          });
      
          let eventQuery = await eventAttendeeRef
            .where('userUid', '==', user.uid)
            .where('eventDate', '>', today);
      
          let eventQuerySnap = await eventQuery.get();
      
          for (let i = 0; i < eventQuerySnap.docs.length; i++) {
            let eventDocRef = await firestore
              .collection('events')
              .doc(eventQuerySnap.docs[i].data().eventId);
            
              let event = await eventDocRef.get();
      
              if (event.data().hostUid === user.uid) {
                batch.update(eventDocRef, {
                  hostPhotoURL: photo.url,
                  [`attendees.${user.uid}.photoURL`]: photo.url
                })
              } else {
                batch.update(eventDocRef, {
                  [`attendees.${user.uid}.photoURL`]: photo.url
                })
              }
          }
          await batch.commit();
          dispatch(asyncActionFinish())
        } catch (error) {
          console.log(error);
          dispatch(asyncActionError())
          throw new Error('Problem setting main photo');
        }
      };

    export const goingToEvent = (event) =>{
        return async (dispatch , getState ) => {
                dispatch(asyncActionStart())
                const firestore = firebase.firestore()
                const user = firebase.auth().currentUser;
                const profile = getState().firebase.profile;
                const attendee = {
                    going : true,
                    host : false,
                    joinDate : new Date(),
                    photoURL : profile.photoURL || '/assets/user.png',
                    displayName : profile.displayName
                }
                try{
                    let eventDocRef = firestore.collection('events').doc(event.id)
                    let eventAttendeeRef = firestore.collection('event_attendee').doc(`${event.id}_${user.id}`)

                    await firestore.runTransaction(async(transaction)=>{
                        await transaction.get(eventDocRef)
                        await transaction.update(eventDocRef ,{
                            [`attendees.${user.uid}`] : attendee 
                    })    

                        await transaction.set(eventAttendeeRef ,{
                            eventId : event.id,
                            userUid : user.uid,
                            eventDate : event.date,
                            host:false
                        } )

                    })

                    dispatch(asyncActionFinish())
                    toastr.success("Success" , "You have signedup to the event")
                }catch(error){
                    console.log(error)
                    dispatch(asyncActionError())
                    toastr.error('Oops' ,'Something Went wrong')
                }
        }
    } 

    export const cancelGoingToEvent = (event) => {
    return async(dispatch ,getState , {getFirebase ,getFirestore}) => {
        const firebase=getFirebase();
        const firestore=getFirestore();
        const user = firebase.auth().currentUser
            try {
                await firestore.update(`events/${event.id}`,{
                    [`attendees.${user.uid}`] : firestore.FieldValue.delete()   //deleteing just one field in object map
                })
                await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
                
                toastr.success('Success' , 'You Removed yourself from the event')
            } catch (error) {
                console.log(error)
                toastr.error('Oops','Something Went Wrong')
            }
    }
}

export const getUserEvents = (userUid, activeTab) =>
async (dispatch , getState) => {
    
    const firestore = firebase.firestore();
    const today = new Date(Date.now())
    const eventsRef = firestore.collection('event_attendee')
    dispatch(asyncActionStart())
    let query;
    switch(activeTab){
        case 1: //past events
        query = eventsRef.where('userUid',"==",userUid).where('eventDate',"<",today).orderBy('eventDate','desc')
        break;
        case 2: //future events 
        query = eventsRef.where('userUid',"==",userUid).where('eventDate',">=",today).orderBy('eventDate')
        break;
        case 3: //event hosted by the user
        query = eventsRef.where('userUid',"==",userUid).where('host',"==",true).orderBy('eventDate','desc')
        break;
        default:
        query = eventsRef.where('userUid',"==",userUid).orderBy('eventDate','desc')
    }
    try{
        let querySnap = await query.get();
        let events=[]
        for(let i=0;i<querySnap.docs.length;i++){
            let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
            events.push({...evt.data(),id:evt.id})
        }
        dispatch({type:FETCH_USER_EVENTS,payload:{events}})
        dispatch(asyncActionFinish())
    }catch(error){
        console.log(error)
        dispatch(asyncActionError())
    }

}

export const followUser = userToFollow =>
    async (dispatch, getState , {getFirebase , getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser
        //const userDocRef = firestore.collection('users').doc(user.uid)
        const following = {
            displayName : userToFollow.displayName,
            city : userToFollow.city || 'unknown' ,
            photoURL : userToFollow.photoURL || '/assets/user.png'
        }
        
        try{
           await firestore.set({
               collection:'users',
               doc:user.uid,
               subcollections : [{collection:'following' , doc:userToFollow.id}]
           } , following)

        }catch(error){
            console.log(error)
        }

    }

    export const unfollowUser = userToUnfollow => 
        async (dispatch , getState, {getFirebase , getFirestore }) => {
            const firestore = getFirestore();
            //const firebase = getFirebase();
            const user = firestore.auth().currentUser
            try {
                await firestore.delete({
                    collection : 'users',
                    doc : user.uid,
                    subcollections : [{collection:'following', doc:userToUnfollow.id}]
                })

            }
            catch(error){
                console.log(error)
            }
        } 