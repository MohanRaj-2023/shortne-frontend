import { HASHTAG_SEARCH_REQUEST,HASHTAG_SEARCH_SUCCESS,HASHTAG_SEARCH_FAIL } from "../Constants/HashragsSearchConstants";


export const HashtagSearchReducer = (state={},actions)=>{
        switch(actions.type){
            case HASHTAG_SEARCH_REQUEST:
                return {loading:true}
            case HASHTAG_SEARCH_SUCCESS:
                console.log("ResulT:",actions.payload)
                return {loading:false,payload:actions.payload}

            case HASHTAG_SEARCH_FAIL:
                return {loading:false,error:actions.error}
            default:
                return state
        }
}