// useMessageSocket.js
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateUnreadMessageCount } from '../Actions/MessageActions'

const useMessagesocket = (token) => {
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!token) {
      console.warn("❌ No token found for message WebSocket.")
      return
    }
      console.log("🔑 Token available for socket:", token); 
      
    // ✅ Connect to the personal WebSocket group (not a specific chat)
    // const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/global/?token=${token}`)
    
    const socket = new WebSocket(`wss://shortne-backend.onrender.com/ws/chat/global/?token=${token}`)

    socket.onopen = () => {
      console.log("✅ Connected to unread message socket");
      socket.send(JSON.stringify({
        type: "get_unread_count"
      }))
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log("Mesage_websocket_data:",data)

      if (data.type === "UNREAD_MESSAGE_COUNT") {
        console.log("✅ Received unread message count:", data.unread_messages)
        dispatch(updateUnreadMessageCount(data.unread_messages))  // update Redux or state
      }
      
      if (data.type === "UNREAD_MESSAGE_COUNT_UPDATE") {
        console.log("updateUnreadMessageCount trigersed....////////////////")
        dispatch(updateUnreadMessageCount(data.unread_messages))
      }
    }

    socket.onerror = (err) => {
      console.error("❌ Message WebSocket error:", err)
    }

    socket.onclose = () => {
      console.warn("🔌 Message WebSocket closed.")
    }

    socketRef.current = socket

    return () => {
      socket.close()
    }
  }, [token])

  return socketRef
}

export default useMessagesocket
