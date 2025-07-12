import api from "../Api/api";
import {NOTIFICATION_REQUEST,NOTIFICATION_SUCCESS,NOTIFICATION_FAIL,
        NOTIFICATION_DELETE_REQUEST,NOTIFICATION_DELETE_SUCCESS,NOTIFICATION_DELETE_FAIL,
    UNREAD_REQUEST,UNREAD_SUCCESS,UNREAD_FAIL,MARK_READ_REQUEST,MARK_READ_SUCCESS,MARK_READ_FAIL} from '../Constants/NotificationConstants'

export const NotificationAction = (access_token)=> async (dispatch)=>{
    try{
        dispatch({
            type:NOTIFICATION_REQUEST
        })

        const config = {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }

        const {data} = await api.get(`notification/not/`,config)

        dispatch({
            type:NOTIFICATION_SUCCESS,
            payload:data?.details
        })

        console.log("Notification_Action:",data?.details)
    }catch(error){
        dispatch({
            type:NOTIFICATION_FAIL,
            error:error?.response?.data?.details ||'Unable to fetch notification...'
        })
    }
}



export const NotificationDeleteAction = (id,access_token)=> async (dispatch)=>{
    try{
        dispatch({
            type : NOTIFICATION_DELETE_REQUEST
        })

        console.log("Noti_id:",id)

        const config = {
            params:{
                'id':id
            },
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }

        const {data} = await api.delete(`notification/delete-not/`,config)

        dispatch({
            type:NOTIFICATION_DELETE_SUCCESS,
            payload:data
        })

    }catch(error){
        dispatch({
            type:NOTIFICATION_DELETE_FAIL,
            error:error.response?.data?.details || 'Unable to delete notification...'
        })
    }
}



export const UnreadAction = (access_token)=> async (dispatch)=>{
    try{
        dispatch({
            type:UNREAD_REQUEST
        })

        const config = {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }

        const {data} = await api.get(`notification/unread-count/`,config)

        dispatch({
            type:UNREAD_SUCCESS,
            payload:data
        })
        console.log("Unread_msg_not_actions:",data)
    }catch(error){
        console.error("UnreadAction error:", error)
        dispatch({
            type:UNREAD_FAIL,
            error:error?.response?.data?.details ||'Unable to fetch unread count...'
        })
    }
}

export const MarkreadAction = (access_token,id)=> async (dispatch)=>{
    try{
        dispatch({
            type:MARK_READ_REQUEST
        })

        const {data} = await api.patch(`notification/mark-read/`,
            {
                'id':id
            },
            {
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${access_token}`
                    
                }
            }
        )
        console.log("Mark_not_Read:================",data)
        dispatch({
            type:MARK_READ_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:MARK_READ_FAIL,
            error:error?.response?.data?.details ||'Unable to read notification...'
        })
    }
}


// update unread notification count
// Actions/UnreadActions.js

export const UPDATE_NOTIFICATION_COUNT = 'UPDATE_NOTIFICATION_COUNT';

export const updateUnreadNotificationCount = (count) => ({
  type: UPDATE_NOTIFICATION_COUNT,
  payload: count,
});
