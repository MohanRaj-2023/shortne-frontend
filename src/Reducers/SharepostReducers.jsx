import { SHARE_POST_REQUEST, SHARE_POST_SUCCESS, SHARE_POST_FAIL } from "../Constants/ShareConstants";


export const SharepostReducer = (state = {}, action) => {
    switch (action.type) {
        case SHARE_POST_REQUEST:
            return { loading: true };
        case SHARE_POST_SUCCESS:
            return { loading: false, success: true };
        case SHARE_POST_FAIL:
            return { loading: false, error: action.payload };
        
        default:
            return state;
    }
}