import api from "../Api/api";
import { SHARE_POST_REQUEST, SHARE_POST_SUCCESS, SHARE_POST_FAIL } from "../Constants/ShareConstants";

export const SharepostAction = (access_token, post, selectedUserIds, message, socketRef, userinfo) => async (dispatch) => {
  try {
    dispatch({ type: SHARE_POST_REQUEST });

    for (let user2_id of selectedUserIds) {
      // 1. Create or fetch chat ID
      const { data } = await api.post(
        'messenger/create/',
        { user2_id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const chatId = data.chat_id;

      // 2. Open a temporary socket and send the message
      const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${access_token}&target_id=${user2_id}`);

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            message: message,
            sender: userinfo.username,
            type: 'chat_message',
            is_post_share: true,
            post: {
              id: post.id,
              description: post.caption,
              media: post.media,           // image/video URL
              media_type: post.media_type  // 'image', 'video', etc.
            },
            timestamp: new Date().toISOString()
          })
        );
        socket.close(); // optional: close if not needed anymore
      };

      socket.onerror = (err) => {
        console.error("WebSocket error on sharing post:", err);
      };
    }

    dispatch({ type: SHARE_POST_SUCCESS });
  } catch (error) {
    dispatch({
      type: SHARE_POST_FAIL,
      payload: error.response?.data?.detail || 'Post sharing failed.'
    });
  }
};