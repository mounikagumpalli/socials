import {  FETCH_EVENTS } from "./eventConstants"
import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions"
import { fetchSampleData } from "../../app/common/data/mockApi"
import { toastr } from "react-redux-toastr"
import { createNewEvent } from "../../app/common/util/helpers"
import firebase from '../../app/config/firebase'

export const createEvt = (event) => {
   return async (dispatch,getState,{getFirebase , getFirestore}) => {
       const firebase = getFirebase();
       const firestore = getFirestore();
       const user = firebase.auth().currentUser;
       const photoURL = getState().firebase.profile.photoURL;
       const displayName = getState().firebase.profile.displayName;
       const newEvent = createNewEvent(user,photoURL,event,displayName)         //created func just to keep the code clean
       dispatch(asyncActionStart())
       try {
           let createdEvent = await firestore.add('events',newEvent)        // added event to Events in firestore
           await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`,{  //adding info to lookUp table;
               eventId : createdEvent.id,
               userUid : user.uid,
               eventDate : event.date,
               host : true
           })
           dispatch(asyncActionFinish())
    toastr.success('Success','EventCreated successfully')
    return createdEvent;                //async methods always return promises weathe mentioned or not.
   }
   catch(err){
       dispatch(asyncActionError())
       toastr.error('ERROR!!','Something went wrong')
   }
}
}

export const cancelToggle = (cancelled,eventId) => {
    return async (dispatch ,getState,{getFirestore}) => {
        const firestore = getFirestore()
        const message = cancelled ? 
        'Are you sure you want to cancel te event?' :
        'This is will reactivate your event, are you sure?'
        try {
                toastr.confirm(message,{
                    onOk : async () =>{
                        await firestore.update(`events/${eventId}`,{
                            cancelled : cancelled
                        })
                    }
                })
        }catch(error){
            console.log(error)
        }

    }

}





export const updateEvt = (event) => {
    return async (dispatch,getState) => {
        const firestore = firebase.firestore()
        dispatch(asyncActionStart())
    try {
        let eventDocRef = firestore.collection('events').doc(event.id)
        let dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date)
        if(!dateEqual){
            let batch = firestore.batch()
            batch.update(eventDocRef,event);
            const eventAttendeeRef =  firestore.collection('event_attendee')
           
            const eventAttendeeQuery = await eventAttendeeRef.where('eventId' , '==' , event.id)
            const eventAttendeeQuerySnap = await eventAttendeeQuery.get()
            
            for(let i=0; i<eventAttendeeQuerySnap.docs.length;i++){
               let eventAttendeeQueryDocRef = await firestore
                .collection('event_attendee')
                .doc(eventAttendeeQuerySnap.docs[i].id);

                batch.update(eventAttendeeQueryDocRef,{
                    eventDate : event.date
                })
            }

            await batch.commit();

        }else {
            await eventDocRef.update(event)
        }
        dispatch(asyncActionFinish())
     toastr.success('Success','Eventupdated successfully')
    }
    catch(err){
        console.log(err)
        toastr.error('ERROR!!','Something went wrong')
    }
 }

}

export const loadEvents = () => {
    return async dispatch => {
        try {
            dispatch(asyncActionStart());
        const events = await fetchSampleData();
        dispatch ({type:FETCH_EVENTS , payload : {events} })
        dispatch(asyncActionFinish())
        }catch(err){
            console.log(err)
            dispatch(asyncActionError)
        }
    }
}

export const getEventsForDashboard=(lastEvent)=>{
    return async (dispatch , getState) => {
        let today = new Date();
        const firestore =firebase.firestore();
        const eventsRef = firestore.collection('events')
        
        try{
            dispatch(asyncActionStart())
            let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get(); //lastevent from the current display
            let query;
            lastEvent ? query = eventsRef
            .where('date','>=',today)
            .orderBy('date')
            .startAfter(startAfter)
            .limit(2)
                    : query = eventsRef
                    .where('date','>=', today)
                    .orderBy('date').limit(2) //first execution

            let querySnap = await query.get();        
            
            if(querySnap.docs.length === 0){
                dispatch(asyncActionFinish())
                return querySnap;
            }

            let events=[];
            for (let i=0;i<querySnap.docs.length;i++){
                let evt = {...querySnap.docs[i].data(),id:querySnap.docs[i].id}
                events.push(evt)
            }
                dispatch({type:FETCH_EVENTS,payload:{events}})
                dispatch(asyncActionFinish())
                return querySnap;
        }catch(error){
            console.log(error)
            dispatch(asyncActionError())
        }
    }
}

export const addEventComment = (eventId,values,parentId) =>{
return async (dispatch,getState,{getFirebase}) =>{
    const firebase = getFirebase();
    const profile = getState().firebase.profile
    const user = firebase.auth().currentUser
    let newComment = {
        parentId:parentId,
        displayName : profile.displayName,
        photoURL : profile.photoURL || '/assets/png',
        uid : user.uid,
        text : values.comment,
        date : Date.now()
    }
    try { 
        await firebase.push(`event_chat/${eventId}`,newComment)
    }catch(error){
        console.log(error)
        toastr.error('Oops','Problem adding comments')
    }

}
}

