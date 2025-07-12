import {NOTIFICATION_REQUEST,NOTIFICATION_SUCCESS,NOTIFICATION_FAIL,
        NOTIFICATION_DELETE_REQUEST,NOTIFICATION_DELETE_SUCCESS,NOTIFICATION_DELETE_FAIL,
        UNREAD_REQUEST,UNREAD_SUCCESS,UNREAD_FAIL,MARK_READ_REQUEST,MARK_READ_SUCCESS,MARK_READ_FAIL,
        UPDATE_NOTIFICATION_COUNT
} from '../Constants/NotificationConstants'


export const NotificationReducer = (state={},actions)=>{
    switch(actions.type){
        case NOTIFICATION_REQUEST:
            return {loading:true}
        case NOTIFICATION_SUCCESS:
            return {loading:false,notifications:actions.payload}
        case NOTIFICATION_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}



export const NotificationDeleteReducer = (state={},actions)=>{
    switch(actions.type){
        case NOTIFICATION_DELETE_REQUEST:
            return {loading:true}
        case NOTIFICATION_DELETE_SUCCESS:
            return {loading:false,payload:actions.payload}
        case NOTIFICATION_DELETE_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}

const initialState = {
    unread_messages: 0,
    unread_notifications: 0
};

export const UnreadReducer = (state=initialState,actions)=>{
    switch(actions.type){
        case UNREAD_REQUEST:
            return {loading:true}
        case UNREAD_SUCCESS:
            return {
                unread_messages: actions.payload.unread_messages,
                unread_notifications: actions.payload.unread_notifications
            };
        case UPDATE_NOTIFICATION_COUNT:
            console.log("UPDATE_NOTIFICATION_COUNT:",actions.payload)
            return {
                ...state,
                unread_notifications: actions.payload,
            };
        case UNREAD_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}


export const MarknotireadReducer = (state={},actions)=>{
    switch(actions.type){
        case MARK_READ_REQUEST:
            return {loading:true}
        case MARK_READ_SUCCESS:
            return {
                loading:false,
                payload: actions.payload
            };
        case MARK_READ_FAIL:
            return {loading:false,error:actions.error}
        default:
            return state
    }
}


//update unread notification

// export const UnreadcountsReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case UPDATE_NOTIFICATION_COUNT:
//       return {
//         ...state,
//         unread_notifications: action.payload,
//       };
//     // other cases...
//     default:
//       return state;
//   }
// };