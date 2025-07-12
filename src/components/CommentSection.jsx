import React, { useState, useEffect } from 'react'
import { Form, Button, Offcanvas, Card, Image } from 'react-bootstrap'
import EmojiPicker from 'emoji-picker-react'
import { CommentAction } from '../Actions/CommentActions'
import { useDispatch, useSelector } from 'react-redux'
// post comment action
import { PostCommentAction } from '../Actions/CommentActions'
// Edit comment action
import { EditCommentAction } from '../Actions/CommentActions'
// Delete comment action
import { DeleteCommentAction } from '../Actions/CommentActions'
// Comment reaction action
import { CommentReactionAction } from '../Actions/ReactionActions'

import Lottie from 'lottie-react'
import FormLoader from '../assets/animations/formloader.json'

const CommentSection = ({ post, show, handleClose }) => {
  console.log("Comment_section:", post)
  const [comment, Setcomment] = useState("")
  const [showemoji, Setshowemoji] = useState(false)

  const Emojihandler = (emojiData) => {
    if (mode == 'create') {
      Setcomment((prev) => prev + emojiData.emoji)
    } else {
      Seteditcomment((prev) => prev + emojiData.emoji)
    }
  }

  const dispatch = useDispatch()
  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  const access_token = userinfo?.access
  const postid = post?.id

  
  const { loading, error, comments } = useSelector((state) => state.Comment)
  const Initialcomments = Array.isArray(comments) ? comments : []
  const [Iscomment, setIscomment] = useState(Initialcomments || [])
  
  // iscomment?.forEach(c=>console.log("COMMENT:",c.comment))
  console.log("Comments:", Initialcomments)
  // get comment
  useEffect(() => {
    dispatch(CommentAction(postid, access_token))
  }, [postid, access_token])

  useEffect(() => {
    setIscomment(Initialcomments); // Always reflect the latest Redux state
  }, [Initialcomments]);


  // Edit comment
  const [mode, Setmode] = useState('create')
  const [editcomment, Seteditcomment] = useState('')
  const [showeditemoji, Setshoweditemoji] = useState(false)
  const [selectedcomment, Setselectedcomment] = useState(null)


  // Post commant
  const Commenthandler = (e) => {
    e.preventDefault()
    console.log("Mode:", mode)
    if (mode === 'edit') {
      if (editcomment.trim() === "") return
      console.log("Selected_comment:", selectedcomment)
      dispatch(EditCommentAction(editcomment, selectedcomment, access_token))
      Setmode('create')
      Setcomment('')
      Setshoweditemoji(false)
      //dispatch(CommentAction(postid,access_token))
    } else {
      if (comment.trim() === "") return  //prevent empty comment post

      // Dispatch the post action and optimistically update UI
      const newComment = {
        id: Date.now(), // temporary unique ID
        username: userinfo?.username,
        comment: comment,
        profileimage: { image: userinfo?.profileimage }, // assuming profileimage from userinfo
        like_count: 0,
        dislike_count: 0,
        is_like: null,
      };

      setIscomment(prev => [newComment, ...prev]);

      dispatch(PostCommentAction(comment, access_token, postid)) //post comment action
    }
    Setcomment("")//make input field null
    Setshowemoji(false) //emoji set false
  }

  const editcommenthandler = (comment) => {
    Seteditcomment(comment.comment)
    Setmode('edit')
    Setselectedcomment(comment.id)
  }

  //  Delete comment
  const deletecommenthandler = (comment) => {
    dispatch(DeleteCommentAction(comment.id, access_token))
  }

  //likehandler

  const [reactionstate, Setreactionstate] = useState({})

  useEffect(() => {
    if (Initialcomments.length > 0) {
      const initialreaction = {}
      Initialcomments.forEach(c => {
        initialreaction[c.id] = c.is_like
      })
      Setreactionstate(initialreaction)
    }
  }, [Initialcomments])

  
  
  const likehandler = (id, is_like) => {
    const newReaction = is_like === true ? null : true; // Toggle like
    Setreactionstate(prev => ({ ...prev, [id]: newReaction }));
    setIscomment(prev =>
      prev?.map(c => {
        if (c.id === id) {
          let newLikeCount = c.like_count;
          let newDislikeCount = c.dislike_count;

          if (is_like === true) {
            // Remove like
            newLikeCount -= 1;
          } else if (is_like === false) {
            // Dislike → Like
            newLikeCount += 1;
            newDislikeCount -= 1;
          } else {
            // Neutral → Like
            newLikeCount += 1;
          }

          return { ...c, like_count: newLikeCount, dislike_count: newDislikeCount };
        }
        return c;
      })
    );

    dispatch(CommentReactionAction(access_token, id, true));
    console.log("Commentid:", id);
  };


  const dislikehandler = (id, is_like) => {
    const newReaction = is_like === false ? null : false; // Toggle dislike
    Setreactionstate(prev => ({ ...prev, [id]: newReaction }));

    setIscomment(prev =>
      prev?.map(c => {
        if (c.id === id) {
          let newLikeCount = c.like_count;
          let newDislikeCount = c.dislike_count;

          if (is_like === false) {
            // Remove dislike
            newDislikeCount -= 1;
          } else if (is_like === true) {
            // Like → Dislike
            newDislikeCount += 1;
            newLikeCount -= 1;
          } else {
            // Neutral → Dislike
            newDislikeCount += 1;
          }

          return { ...c, like_count: newLikeCount, dislike_count: newDislikeCount };
        }
        return c;
      })
    );

    dispatch(CommentReactionAction(access_token, id, false));
    console.log("Commentid:", id);
  };

  return (
    <Offcanvas show={show} placement='end' onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Commant</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div className='bg-light p-4'>
          <Form className='mt-4' onSubmit={Commenthandler}>
            <Form.Control
              type='text'
              placeholder='commant...'
              value={comment}
              onChange={(e) => Setcomment(e.target.value)} />

            <Button variant='outline-secondary' className='m-4' onClick={() => Setshowemoji(!showemoji)}>😊</Button>

            <Button className='m-4' type='submit'  >Post</Button>


            {showemoji && (
              <div className='mt-4 col-md-8 col-lg-6'>
                <EmojiPicker onEmojiClick={Emojihandler}></EmojiPicker>
              </div>
            )}

          </Form>

          {/* comment */}

          {
            loading && (
              <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
              </div>
            )
          }

          {Iscomment?.length > 0 && (
            [...Iscomment].reverse().map((c, index) => (

              <div key={c.id} className='mb-3'>
                <Card border={mode == 'edit' && selectedcomment === c.id ? 'warning' : ''}>
                  <Card.Body>
                    <div className='d-flex align-items-center gap-3'>
                      <Image
                        src={`${c.profileimage.image}`}
                        className='rounded-circle pr-3'
                        width="40px"
                        height="40px"
                      />
                      <span className='fw-bold'>{c.username}</span>
                    </div>


                    {userinfo?.username === c.username ? (
                      <div className='m-2'>
                        <div className="d-flex align-items-center gap-3">
                          <span><i className="fa-solid fa-pen-to-square" onClick={() => editcommenthandler(c)} style={{ cursor: 'pointer' }} ></i></span>
                          <span><i className='fa-solid fa-trash' style={{ cursor: 'pointer' }} onClick={() => deletecommenthandler(c)}></i></span>
                        </div>
                        <span>{c.comment}</span>

                        <div className='d-flex gap-4 mt-2'>
                          {/* Like Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {
                              reactionstate[c.id] === true ? (
                                <i className="fa-solid fa-thumbs-up" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => likehandler(c.id, reactionstate[c.id])}></i>
                              ) : (
                                <i className="fa-regular fa-thumbs-up" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => likehandler(c.id, reactionstate[c.id])}></i>
                              )
                            }
                            <span style={{ fontSize: '13px', marginTop: '3px' }}>{c.like_count}</span>
                          </div>


                          {/* Dislike Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {
                              reactionstate[c.id] === false ? (
                                <i className="fa-solid fa-thumbs-down" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => dislikehandler(c.id, reactionstate[c.id])}></i>
                              ) : (
                                <i className="fa-regular fa-thumbs-down" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => dislikehandler(c.id, reactionstate[c.id])}></i>
                              )
                            }
                            <span style={{ fontSize: '13px', marginTop: '3px' }}>{c.dislike_count}</span>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className='m-2'>
                        <span>{c.comment}</span>
                        <div className='d-flex gap-4 mt-2'>
                          {/* Like Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {
                              reactionstate[c.id] === true ? (
                                <i className="fa-solid fa-thumbs-up" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => likehandler(c.id, reactionstate[c.id])}></i>
                              ) : (
                                <i className="fa-regular fa-thumbs-up" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => likehandler(c.id, reactionstate[c.id])}></i>
                              )
                            }
                            <span style={{ fontSize: '13px', marginTop: '3px' }}>{c.like_count}</span>
                          </div>


                          {/* Dislike Section */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {
                              reactionstate[c.id] === false ? (
                                <i className="fa-solid fa-thumbs-down" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => dislikehandler(c.id, reactionstate[c.id])}></i>
                              ) : (
                                <i className="fa-regular fa-thumbs-down" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => dislikehandler(c.id, reactionstate[c.id])}></i>
                              )
                            }
                            <span style={{ fontSize: '13px', marginTop: '3px' }}>{c.dislike_count}</span>
                          </div>
                        </div>

                      </div>



                    )}

                    {mode === 'edit' && selectedcomment === c.id && (
                      <div>
                        <Form className='mt-4' onSubmit={Commenthandler}>
                          <Form.Control
                            type='text'
                            placeholder='commant...'
                            value={editcomment}
                            onChange={(e) => Seteditcomment(e.target.value)} />

                          <Button variant='outline-secondary' className='m-4' onClick={() => Setshoweditemoji(!showeditemoji)}>😊</Button>

                          <Button className='m-4' type='submit' variant='warning'  >Update</Button>


                          {showeditemoji && (
                            <div className='mt-4 col-md-8 col-lg-6'>
                              <EmojiPicker onEmojiClick={Emojihandler}></EmojiPicker>
                            </div>
                          )}

                        </Form>

                      </div>
                    )}



                  </Card.Body>
                </Card>

              </div>
            )
            ))}

          {/* commant form */}

        </div>


      </Offcanvas.Body>
    </Offcanvas>

  )
}

export default CommentSection