import { ASYNC_ACTION_START, ASYNC_ACTION_FINISH, ASYNC_ACTION_ERROR } from "./asyncConstants"

export const asyncActionStart = (elementName) => {
    return {
        type : ASYNC_ACTION_START,
        payload : {
            elementName
        }
    }
}

export const asyncActionFinish = () => {
    return {
        type : ASYNC_ACTION_FINISH
    }
}

export const asyncActionError = () => {
    return {
        type : ASYNC_ACTION_ERROR
    }
}
