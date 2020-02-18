import { INCREMENT, DECREMENT } from "./testConstants"
import {  asyncActionFinish } from "../async/asyncActions"
import { ASYNC_ACTION_START } from "../async/asyncConstants"


export const increment = () => {
    return {
        type : INCREMENT
    }
}

export const decrement = () => {
    return {
        type : DECREMENT
    }
}

const delay = (ms) => {
    return new Promise((resolve)=> setTimeout(resolve,ms)) //resolve = after the prev task is completed, timer is set for x ms
}

export const incrementAsync = (elementName) => {
    return async dispatch => {
            dispatch({type:ASYNC_ACTION_START , payload:elementName })
            await(delay(1000))
            dispatch({type : INCREMENT})
            dispatch(asyncActionFinish())
    }
}

export const decrementAsync = (elementName) => {
    return async dispatch => {
        dispatch(({type:ASYNC_ACTION_START , payload:elementName }))
        await(delay(1000))
        dispatch({type:DECREMENT})
        dispatch(asyncActionFinish())
    }
}