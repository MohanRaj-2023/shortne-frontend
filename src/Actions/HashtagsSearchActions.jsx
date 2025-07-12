import api from '../Api/api'
import {HASHTAG_SEARCH_REQUEST,HASHTAG_SEARCH_SUCCESS,HASHTAG_SEARCH_FAIL} from '../Constants/HashragsSearchConstants'


export const HashtagSearchAction = (query)=> async(dispatch)=>{
    try{
        dispatch({
            type: HASHTAG_SEARCH_REQUEST
        })
        
        const {data} = await api.get(`post/hashtags/search/?q=${query}`)
     

        dispatch({
            type: HASHTAG_SEARCH_SUCCESS,
            payload:data
        })
    }
    catch(error){
        dispatch({
            type:HASHTAG_SEARCH_FAIL,
            error:error.response?.data?.details || 'No matching hastags found....'
        })
    }
}