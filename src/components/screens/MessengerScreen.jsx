import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Card, Image, Form, FormControl, Button } from 'react-bootstrap'
import { FriendsAction } from '../../Actions/FollowActions'
import { useDispatch, useSelector } from 'react-redux'
import Messageuser from '../Messageuser'
import EmojiPicker from 'emoji-picker-react'
// chatid action
import { ChatidAction } from '../../Actions/MessageActions'
import { ChatAction } from '../../Actions/MessageActions'
import { MarkreadAction } from '../../Actions/MessageActions'
import { UseronlinestatusAction } from '../../Actions/MessageActions'
import { UnreadmessagecountAction } from '../../Actions/MessageActions'
import { LastmessageAction } from '../../Actions/MessageActions'

import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'

import { Link } from 'react-router-dom'

const MessengerScreen = () => {
    const dispatch = useDispatch()
    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
    const access_token = userinfo?.access

    useEffect(() => {
        if (access_token) {
            console.log("Dispatching LastmessageAction...");
            dispatch(FriendsAction(access_token))
            dispatch(UseronlinestatusAction(access_token))
            dispatch(UnreadmessagecountAction(access_token));
            dispatch(LastmessageAction(access_token));
        }
    }, [access_token])

    const chatList = useSelector((state) => state.Lastchat.chats || []);
    // console.log("Last_Message:", chatList)

    const reduxUnreadCounts = useSelector((state) => state.Unreadmsgcount?.payload || {});
    const [localUnreadCounts, setLocalUnreadCounts] = useState({});

    // const unreadCounts = useSelector((state) => state.Unreadmsgcount?.payload || {});

    console.log("Unread_Messagecount reduxcount:----------------", reduxUnreadCounts)



    useEffect(() => {
        if (Object.keys(reduxUnreadCounts).length > 0) {
            setLocalUnreadCounts(reduxUnreadCounts);
        }
    }, [reduxUnreadCounts]);

    const updateUnreadCount = (userId) => {
        setLocalUnreadCounts(prev => ({
            ...prev,
            [userId]: (prev[userId] || 0) + 1,
        }));
    };
    console.log("Unread_Messagecount local count:----------------", localUnreadCounts)

    const { friends, loading, error } = useSelector((state) => state.Friendslist)
    console.log("Friends:", friends)

    const OnlineStatus = useSelector((state) => state.Onlinestatus?.payload || [])
    console.log("Online_Status:", OnlineStatus)

    //const isOnline = (userId) => OnlineStatus?.includes(userId);


    const [user, Setuser] = useState()
    const [message, Setmessage] = useState('')
    const [Realtimemessages, SetRealtimemessages] = useState([])
    const socketRef = useRef(null)
    const messagesEndRef = useRef(null)
    const markTimeoutRef = useRef(null);
    const [chatUserOnline, setChatUserOnline] = useState(false);
    const chatPartnerRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);



    useEffect(() => {
        if (user && user.id) {
            chatPartnerRef.current = user.user;
        }
    }, [user]);


    // console.log("Chat_USER_ONLINE:", chatUserOnline)

    console.log("receiver_info:", user?.user)
    useEffect(() => {
        if (access_token && user?.user) dispatch(ChatidAction(access_token, user.user))
    }, [access_token, user?.id])

    // const [chatid,setChatid] = useState()
    const chatId = useSelector((state) => state.Chatid?.chatid?.chat_id)
    console.log("Chatid:", chatId)

    useEffect(() => {
        setChatUserOnline(false); // Reset to offline when new chat starts
    }, [chatId]);

    //    console.log("Messaging with:",user)
    useEffect(() => {
        if (!chatId || !user) return
        if (socketRef.current) {
            socketRef.current.close()
        }
        // socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${String(chatId)}/?token=${access_token}&target_id=${user.id}`)

        socketRef.current = new WebSocket(`wss://shortne-backend.onrender.com/ws/chat/${String(chatId)}/?token=${access_token}&target_id=${user.user}`)

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
            setSocketConnected(true)
            dispatch(ChatAction(access_token, chatId))

            // ✅ Start heartbeat after connection opens
            heartbeatIntervalRef.current = setInterval(() => {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: "heartbeat" }));
                }
            }, 30000); // every 30 sec
        };


        socketRef.onclose = () => {
            console.log("WebSocket closed");
            clearInterval(heartbeatIntervalRef.current);
        };

        socketRef.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log("WebSocket message:", data);

            if (data.type === "user_status") {
                if (chatPartnerRef.current && data.user_id === chatPartnerRef.current) {
                    setChatUserOnline(data.is_online);
                }
            }

            if (data.type === "chat_alert") {
                const fromUser = data.from_user_id;
                const chatId = data.chat_id;

                if (!user || fromUser !== user.id) {
                    // ✅ Show badge on the user in chat list
                    updateUnreadCount(fromUser); // or toggle indicator
                }
            }

            // 1. Handle "mark_messages_read" broadcast
            else if (data.type === "mark_messages_read") {
                const readIds = data.message_ids;
                // Update real-time messages' is_read flag
                SetRealtimemessages(prev =>
                    prev.map(msg =>
                        readIds.includes(msg.id) ? { ...msg, is_read: true } : msg
                    )
                );

                // Also update fetched messages
                setFetchedmessages(prev =>
                    prev.map(msg =>
                        readIds.includes(msg.id) ? { ...msg, is_read: true } : msg
                    )
                );
            }
            else if (data.type === "chat_message") {
                const messageObj = {
                    id: data.message_id,
                    chat: data.chat,
                    message: data.message,
                    sender: {
                        id: data.sender_id,
                        username: data.sender
                    },
                    is_read: false,
                    timestamp: new Date().toISOString(),
                    post: data.post_id
                        ? {
                            id: data.post_id,
                        }
                        : null

                };

                SetRealtimemessages(prev => [...prev, messageObj]);


                if (data.sender !== userinfo.username) {
                    const currentChatPartnerId = user?.user;
                    if (String(data.sender_id) !== String(currentChatPartnerId)) {
                        dispatch(UnreadmessagecountAction(access_token)); // New message from other chat
                    } else {
                        // In the open chat, auto-mark it as read
                        if (markTimeoutRef.current) clearTimeout(markTimeoutRef.current);
                        markTimeoutRef.current = setTimeout(() => {
                            markAsRead();
                        }, 500);
                    }
                }

            }


            else {
                console.warn("Unknown WebSocket message type:", data);
            }


            // SetRealtimemessages(prev => [...prev, data]);
        };
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                clearInterval(heartbeatIntervalRef.current);
            }
        }

    }, [chatId, user, access_token])

    // console.log("Messages:",Realtimemessages)

    const sendMessage = () => {
        if (message.trim() === '') return;

        // if (!socketRef.current) {
        //     console.warn("⚠️ WebSocket not initialized");
        //     return;
        // }

        // if (socketRef.current.readyState !== WebSocket.OPEN) {
        //     console.warn("❌ WebSocket is not open yet. readyState =", socketRef.current.readyState);
        //     return;
        // }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                message: message,
                sender: userinfo.username
            }));
            Setmessage('');
        } else {
            console.warn("WebSocket is not open");
        }

        // socketRef.current.send(JSON.stringify({
        //     message: message,
        //     sender: userinfo.username
        // }));
        // Setmessage('');
    };

    // Auto scroll to bottom on messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [Realtimemessages])

    // Get user chats
    const chats = useSelector((state) => state.Chat?.chat)
    // console.log("USER_CHAT:",chats)

    const [fetchedmessages, setFetchedmessages] = useState([])

    useEffect(() => {
        if (chats && chats.length > 0) {
            setFetchedmessages(chats)
            markAsRead();
        }
    }, [chats])

    useEffect(() => {
        SetRealtimemessages([]);  // clear old chat messages on chat switch
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [fetchedmessages, chatId]);



    // Emoji
    const [showemoji, Setshowemoji] = useState(false)
    const Emojihandler = (emojiData) => {
        Setmessage((prev) => prev + emojiData.emoji)
    }

    // mark as is_read
    const markAsRead = () => {
        if (chatId && access_token && user) {
            dispatch(MarkreadAction(access_token, chatId, user?.user))

        }
    }

    // const [activeChatUserId, setActiveChatUserId] = useState(null);

    const is_read = useSelector((state) => state.Isread?.payload)

    useEffect(() => {
        if (chats && chats.length > 0) {
            setFetchedmessages(chats);
            markAsRead(); // mark as read when chat is loaded
        }
    }, [chats]);



    console.log("Realtime_msg:", Realtimemessages)
    console.log("Fetched_message:", fetchedmessages)


    return (
        <Container fluid className='mt-5 mb-5' style={{ height: '100vh', overflow: 'hidden' }}>
            <Row className="h-100">
                <Col md={4} className="bg-white d-none d-md-block mb-5" style={{ height: '100%', marginLeft: '80px' }}>
                    <Card style={{ height: '100%' }} className='mb-3'>
                        <Card.Body style={{ overflowY: 'auto', height: '100%' }}>
                            <div className="mb-3">
                                <b>Zone Messenger</b>
                            </div>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                                    <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                                </div>
                            ) :
                                Array.isArray(friends) && friends.length > 0 ? (
                                    [...friends]
                                        .map(friend => {
                                            const lastChat = chatList.find(chat => chat.friend.id === friend.user);
                                            console.log("last_chat:", lastChat)
                                            // const lastTimestamp = lastChat?.last_message?.timestamp || lastChat?.last_message?.created_at || '';
                                            const lastTimestamp = lastChat?.last_message?.timestamp || lastChat?.last_message?.created_at || '1970-01-01T00:00:00Z';

                                            return {
                                                ...friend,
                                                lastTimestamp,
                                                lastMessage: lastChat?.last_message?.content || 'No messages yet'
                                            };
                                        })
                                        .sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp))
                                        .map((user, index) => {

                                            const unreadCount = localUnreadCounts[user.user] || reduxUnreadCounts[user.user] || 0;


                                            return (
                                                <div key={user.id}>
                                                    <div
                                                        className="gap-3 d-flex align-items-center justify-content-between mb-3"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            Setuser(user);
                                                            setLocalUnreadCounts(prev => {
                                                                const updated = { ...prev };
                                                                delete updated[user.id];
                                                                return updated;
                                                            });
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="position-relative">
                                                                <Image
                                                                    src={`${user.image}`}
                                                                    height="40"
                                                                    width="40"
                                                                    className="rounded-circle"
                                                                />
                                                                {unreadCount > 0 && (
                                                                    <span
                                                                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                                                                        style={{ width: '10px', height: '10px' }}
                                                                    ></span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold">{user.username}</div>
                                                                <div className="text-muted small" style={{ maxWidth: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                                    {user.lastMessage}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <small className="text-muted">
                                                            {user.lastTimestamp ? new Date(user.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </small>
                                                    </div>
                                                    {index !== friends.length - 1 && <hr />}
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="text-center text-muted mt-5">
                                        You don’t have any friends yet.
                                    </div>
                                )}


                        </Card.Body>
                    </Card>
                </Col>

                {/* sm screen */}
                <Col md={4} className="bg-white  d-md-none mb-5" style={{ height: '100%' }}>
                    <Card style={{ height: '100%' }}>
                        <Card.Body style={{ overflowY: 'auto' }}>
                            <div className="mb-3">
                                <b>Zone Messenger</b>
                            </div>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                                    <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                                </div>
                            ):
                            Array.isArray(friends) && friends.length > 0 ? (

                                [...friends]
                                    .map(friend => {
                                        const lastChat = chatList.find(chat => chat.friend.id === friend.user);
                                        const lastTimestamp = lastChat?.last_message?.timestamp || lastChat?.last_message?.created_at || '';
                                        return {
                                            ...friend,
                                            lastTimestamp,
                                            lastMessage: lastChat?.last_message?.content || 'No messages yet'
                                        };
                                    })
                                    .sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp))
                                    .map((user, index) => {
                                        const unreadCount = localUnreadCounts[user.user] || reduxUnreadCounts[user.user] || 0;

                                        return (
                                            <div key={user.id}>
                                                <div
                                                    className="gap-3 d-flex align-items-center justify-content-between mb-3"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        Setuser(user);
                                                        setLocalUnreadCounts(prev => {
                                                            const updated = { ...prev };
                                                            delete updated[user.id];
                                                            return updated;
                                                        });
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="position-relative">
                                                            <Image
                                                                src={`${user.image}`}
                                                                height="40"
                                                                width="40"
                                                                className="rounded-circle"
                                                            />
                                                            {unreadCount > 0 && (
                                                                <span
                                                                    className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                                                                    style={{ width: '10px', height: '10px' }}
                                                                ></span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{user.username}</div>
                                                            <div className="text-muted small" style={{ maxWidth: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                                {user.lastMessage}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">
                                                        {user.lastTimestamp ? new Date(user.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </small>
                                                </div>
                                                {index !== friends.length - 1 && <hr />}
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="text-center text-muted mt-5">
                                    You don’t have any friends yet.
                                </div>
                            )}


                        </Card.Body>
                    </Card>
                </Col>

                {/* Chat area */}
                {
                    user ? (
                        <Col style={{ height: '100%' }} className='mb-5'>
                            <Card style={{ height: '100%' }}  >
                                <div className="d-flex gap-3 p-3">
                                    <Image
                                        src={`${user.image}`}
                                        height={'40'}
                                        width={'40'}
                                        className='rounded-circle'
                                        alt='chat-window' />

                                    <div>
                                        <p className='fw-bold mb-0'>{user.username}</p>
                                        <small className='text-muted'>
                                            <span
                                                style={{
                                                    height: '10px',
                                                    width: '10px',
                                                    backgroundColor: chatUserOnline ? 'green' : 'grey',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    marginRight: '5px',
                                                }}
                                            />
                                            {chatUserOnline ? 'Online' : 'Offline'}
                                        </small>

                                    </div>


                                </div>
                                <Card.Body className='bg-light d-flex flex-column' style={{ height: '60vh' }}>
                                    {/* Scrollable message area */}
                                    <div
                                        style={{
                                            flex: 1,
                                            overflowY: 'auto',
                                            paddingRight: '10px',
                                            marginBottom: '10px'
                                        }}
                                    >

                                        <ul className="list-unstyled flex-grow-1 mb-2">
                                            {[...fetchedmessages, ...Realtimemessages]
                                                .filter(msg => String(msg.chat) === String(chatId))
                                                .sort((a, b) => new Date(a.created_at || a.timestamp) - new Date(b.created_at || b.timestamp))
                                                .map((msg) => {
                                                    const messageText = msg.message || msg.content;
                                                    const senderId = typeof msg.sender === 'object' ? msg.sender.id : msg.sender;
                                                    const isSender = senderId === userinfo.id || senderId === userinfo.username;
                                                    const isRead = msg.is_read;
                                                    // const isOnline = onlineUsers.has(user.id);

                                                    return (

                                                        <li
                                                            key={msg.id}
                                                            className={`d-flex mb-2 ${isSender ? 'justify-content-end' : 'justify-content-start'}`}
                                                        >
                                                            <div
                                                                style={{
                                                                    maxWidth: '60%',
                                                                    padding: '10px 15px',
                                                                    borderRadius: '15px',
                                                                    backgroundColor: isSender ? '#0d6efd' : '#e4e6eb',
                                                                    color: isSender ? 'white' : 'black',
                                                                    wordBreak: 'break-word',
                                                                    position: 'relative',
                                                                }}
                                                            >
                                                                {msg.is_post_share && msg.post ? (
                                                                    <div className="shared-post">
                                                                        {msg.shared_post_media_type === "image" && (
                                                                            <img
                                                                                src={`${msg.shared_post_media}`}
                                                                                alt="shared"
                                                                                style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "5px" }}
                                                                            />

                                                                        )}
                                                                        {msg.shared_post_media_type === "video" && (
                                                                            <video controls style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "5px" }}>
                                                                                <source src={`${msg.shared_post_media}`} type="video/mp4" />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        )}

                                                                        <p>
                                                                            {msg.shared_post_description.length > 100
                                                                                ? msg.shared_post_description.slice(0, 100) + '...'
                                                                                : msg.shared_post_description}
                                                                        </p>

                                                                        <Link
                                                                            to={`/poast/${msg.post}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ fontSize: '0.8rem', color: isSender ? '#cce5ff' : '#007bff', textDecoration: 'underline' }}
                                                                        >
                                                                            View Full Post
                                                                        </Link>
                                                                        <div className='mt-3'>
                                                                            <span>{messageText}</span>
                                                                        </div>

                                                                    </div>

                                                                ) : (
                                                                    <span>{messageText}</span>
                                                                )}

                                                                <div
                                                                    className="d-flex justify-content-end mt-1"
                                                                    style={{ fontSize: '0.7rem', color: isSender ? '#d0d0d0' : '#555' }}
                                                                >
                                                                    <span>
                                                                        {new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                    {isSender && (
                                                                        <span className="ms-2">{isRead ? '✓✓' : '✓'}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}

                                        </ul>
                                        <div ref={messagesEndRef} />
                                    </div>


                                    <div>
                                        <div>
                                            <FormControl type='text' value={message} onChange={(event) => Setmessage(event.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                                            <div>

                                            </div>
                                            <div className="d-flex justify-content-end mt-2">
                                                <Button variant='outline-secondary' className='m-2' onClick={() => Setshowemoji(!showemoji)}>😊</Button>

                                                <div className="mr-2 mt-2">
                                                    <Button type='submit' onClick={sendMessage} disabled={!socketConnected}>Send</Button>
                                                </div>
                                            </div>

                                            {showemoji && (
                                                <div className='d-flex justify-content-end mt-1'>
                                                    <EmojiPicker onEmojiClick={Emojihandler}></EmojiPicker>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                    ) : (
                        <Col className="text-center p-4 bg-light">
                            <Image
                                src="/chatingimg.jpg"
                                style={{ maxWidth: "700px", width: "100%", height: "auto", margin: "0 auto", display: "block" }}
                                alt="Chatting Illustration"
                            />
                            <p className="mt-3 fs-5 text-dark">Connect. Share. Chat like never before!</p>
                        </Col>
                    )
                }
            </Row>
        </Container>

    )
}

export default MessengerScreen