import {
    CHAT_ID_REQUEST, CHAT_ID_SUCCESS, CHAT_ID_FAIL,
    CHAT_REQUEST, CHAT_SUCCESS, CHAT_FAIL,
    MARK_READ_REQUEST, MARK_READ_SUCCESS, MARK_READ_FAIL,
    USER_ONLINE_STATUS_REQUEST, USER_ONLINE_STATUS_SUCCESS, USER_ONLINE_STATUS_FAIL,
    UNREAD_MESSAGE_COUNT_REQUEST, UNREAD_MESSAGE_COUNT_SUCCESS, UNREAD_MESSAGE_COUNT_FAIL,
    CLEAR_UNREAD_COUNT, LAST_MESSAGE_REQUEST, LAST_MESSAGE_SUCCESS, LAST_MESSAGE_FAIL,LAST_MESSAGE_UPDATE,
    UPDATE_MESSAGE_COUNT
} from "../Constants/MessageContext";



export const ChatidReducer = (state = {}, action) => {
    switch (action.type) {
        case CHAT_ID_REQUEST:
            return { ...state, loading: true, error: null }
        case CHAT_ID_SUCCESS:
            console.log("Chatid_reduer:",action.payload)
            return { ...state, loading: false, chatid: action.payload }
        case CHAT_ID_FAIL:
            return { ...state, loading: false, error: action.error }
        default:
            return state
    }
}

export const ChatReducer = (state = {}, action) => {
    switch (action.type) {
        case CHAT_REQUEST:
            return { ...state, loading: true, error: null }
        case CHAT_SUCCESS:
            // console.log("Chat_reduer:+++++++",action.payload)
            return { ...state, loading: false, chat: action.payload }
        case CHAT_FAIL:
            return { ...state, loading: false, error: action.error }
        default:
            return state
    }
}

// markread reducer
export const MarkreadReducer = (state = {}, action) => {
    switch (action.type) {
        case MARK_READ_REQUEST:
            return { ...state, loading: true, error: null }
        case MARK_READ_SUCCESS:
            // console.log("Is_read_Reducer:",action.payload)
            return { ...state, loading: false, payload: true }
        case MARK_READ_FAIL:
            return { ...state, loading: false, payload: action.error }
        default:
            return state
    }
}

// online status
export const UseronlinestatusReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_ONLINE_STATUS_REQUEST:
            return { ...state, loading: true, error: null }
        case USER_ONLINE_STATUS_SUCCESS:
            console.log("Online_Reducer:", action.payload)
            return { ...state, loading: false, payload: action.payload }
        case USER_ONLINE_STATUS_FAIL:
            return { ...state, loading: false, payload: action.error }
        default:
            return state
    }
}

// Unread msg count
export const UnreadmessagecountReducer = (state = {}, action) => {
    switch (action.type) {
        case UNREAD_MESSAGE_COUNT_REQUEST:
            return { ...state, loading: true, error: null }
        case UNREAD_MESSAGE_COUNT_SUCCESS:
            console.log("Unread_msg_reducer:", action.payload)
            return { ...state, loading: false, payload: action.payload }
        case UPDATE_MESSAGE_COUNT:
            console.log("Unread_msg_count_reducer:", action.payload)
            return {
                ...state,
                payload: action.payload,
            }
        case CLEAR_UNREAD_COUNT:
            const updated = { ...state.payload };
            delete updated[action.payload];
            return { ...state, payload: updated };
        case UNREAD_MESSAGE_COUNT_FAIL:
            return { ...state, loading: false, payload: action.error }
        default:
            return state
    }
}

// // last message
const initialState = {
    loading: false,
    chats: [],  // <-- this prevents 'state.chat is undefined'
    error: null,
};

export const LastchatReducer = (state = initialState, action) => {
  switch(action.type) {
    case LAST_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null };
    case LAST_MESSAGE_SUCCESS:
      return { ...state, loading: false, chats: action.payload };
    case LAST_MESSAGE_FAIL:
      return { ...state, loading: false, error: action.error };
    case LAST_MESSAGE_UPDATE:
      return {
        ...state,
        chats: state.chats.map(c =>
          c.id === action.payload.chatId
            ? { ...c, last_message: action.payload.lastMessage }
            : c
        ),
      };
    default:
      return state;
  }
};