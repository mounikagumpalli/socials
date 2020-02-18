import { createReducer } from "../../app/common/util/reducerUtils"
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, FETCH_EVENTS, FETCH_USER_EVENTS } from "./eventConstants"

 const initialState ={
     events : [],
     userEvents : []
 };

const createEvt = (state,payload) => {
    return [...state,payload.event]
 } 

const deleteEvt = (state,payload) => {
    return [...state.filter(event => event.id !== payload.id)]
    }

    const updateEvt = (state , payload) => {
        return [...state.filter(event => event.id!==payload.event.id),payload.event]
    }

    const loadEvents = (state , payload) => {
      return {
          ...state,
          events : payload.events
      }

    }

    const fetchUserEvents = (state , payload) => {
        return {
            ...state,
            userEvents : payload.events
        }
  
      }


    export default createReducer(initialState , {
        [CREATE_EVENT] : createEvt,
        [DELETE_EVENT] : deleteEvt,
        [UPDATE_EVENT] : updateEvt,
        [FETCH_EVENTS] : loadEvents,
        [FETCH_USER_EVENTS] : fetchUserEvents
    })