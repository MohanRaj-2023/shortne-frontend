import api from "../Api/api";
import { CHAT_ID_REQUEST,CHAT_ID_SUCCESS,CHAT_ID_FAIL,
         CHAT_REQUEST,CHAT_SUCCESS,CHAT_FAIL,
         MARK_READ_REQUEST,MARK_READ_SUCCESS,MARK_READ_FAIL,
         USER_ONLINE_STATUS_REQUEST,USER_ONLINE_STATUS_SUCCESS,USER_ONLINE_STATUS_FAIL,
         UNREAD_MESSAGE_COUNT_REQUEST,UNREAD_MESSAGE_COUNT_SUCCESS,UNREAD_MESSAGE_COUNT_FAIL,
         LAST_MESSAGE_REQUEST,LAST_MESSAGE_SUCCESS,LAST_MESSAGE_FAIL,UPDATE_MESSAGE_COUNT
 } from "../Constants/MessageContext";

 

export const ChatidAction = (access_token,user2_id)=>async(dispatch)=>{
    try{
        dispatch({
            type:CHAT_ID_REQUEST
        })

        console.log("Receiving_User:",user2_id)
        const {data} = await api.post(`messenger/create/`,
            {
                "user2_id":user2_id
            },
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            }
        )

        // console.log("Chatid_Action:",data)

        dispatch({
            type:CHAT_ID_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:CHAT_ID_FAIL,
            error:error.response?.data?.details || 'Unable to fetch chatid'
        })
    }
}


export const ChatAction = (access_token,chat_id)=>async (dispatch)=>{
        try{
            dispatch({
                type:CHAT_REQUEST
            })

            const config = {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            }


            const {data} = await api.get(`messenger/chat/${chat_id}/messages/`,config)

            dispatch({
                type:CHAT_SUCCESS,
                payload:data
            })

            // console.log("Chat_Action:====",data)
        }catch(error){
            dispatch({
                type:CHAT_FAIL,
                error:error.response?.data?.details || 'Unable to fetch chat.'
            })
        }
}

// Markread action
export const MarkreadAction = (access_token,chat_id,sender_id)=>async(dispatch)=>{
    try{
        dispatch({
            type:MARK_READ_REQUEST
        })

         const config = {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            }

        const {data} = await api.post(`messenger/chat/${chat_id}/mark_read/`,{},config)

        dispatch({
            type:MARK_READ_SUCCESS,
            payload:data
        })

        dispatch({
        type: 'CLEAR_UNREAD_COUNT',
        payload: sender_id,
        });

        // console.log("Is_read_Action:",data)
    }catch(error){
        dispatch({
            type:MARK_READ_FAIL,
            error:error.response?.data || 'Failed to mark message as read'
        })
    }
}

//user-online status
export const UseronlinestatusAction = (access_token)=>async(dispatch)=>{
    try{
        dispatch({
            type:USER_ONLINE_STATUS_REQUEST
        })

        const {data} = await api.get(`messenger/online-users/`,
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            })

        dispatch({
            type:USER_ONLINE_STATUS_SUCCESS,
            payload:data.online_users
        })
        // console.log("Onlinestatus_Action:",data)

        

    }catch(error){
        dispatch({
            type:USER_ONLINE_STATUS_FAIL,
            error:error.response?.data || 'Failed to fetch online status'
        })
    }
}

//unread message count action
export const UnreadmessagecountAction = (access_token)=>async(dispatch)=>{
    try{
        dispatch({
            type:UNREAD_MESSAGE_COUNT_REQUEST
        })

        const {data} = await api.get(`messenger/unread-counts/`,
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            })

        dispatch({
            type:UNREAD_MESSAGE_COUNT_SUCCESS,
            payload:data
        })
        console.log("Unread_Msg_Action:",data)
    }catch(error){
        dispatch({
            type:UNREAD_MESSAGE_COUNT_FAIL,
            error:error.response?.data || 'Failed to fetch unread msg count'
        })
    }
}

// actions/UnreadActions.js


export const updateUnreadMessageCount = (count) => (
{
  type: UPDATE_MESSAGE_COUNT,
  payload: count,
}
)


//last message action
export const LastmessageAction = (access_token)=>async(dispatch)=>{
    try{
        console.log("Calling LastmessageAction API...");
        dispatch({
            type:LAST_MESSAGE_REQUEST
        })

        const {data} = await api.get(`messenger/chats/`,
            {
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            })

        dispatch({
            type:LAST_MESSAGE_SUCCESS,
            payload:data
        })
        console.log("Last_Msg_Action:",data)
    }catch(error){
        console.error("LastmessageAction error:", error);
        dispatch({
            type:LAST_MESSAGE_FAIL,
            error:error.response?.data || 'Failed to fetch last msg'
        })
       
    }
}