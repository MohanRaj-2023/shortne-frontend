import React, { useEffect, useState, useRef } from 'react'
import { Card, Container, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { PostAction } from '../../Actions/PostActions'
import { useDispatch, useSelector } from 'react-redux'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Link } from 'react-router-dom'
import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'

// edit post
import { PostEditAction } from '../../Actions/PostCreateActions'

const Editpostscreen = () => {
  const { post_id } = useParams()
  const dispatch = useDispatch()

  const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
  const username = userinfo?.username
  const access_token = userinfo?.access
  const post = useSelector((state) => state.Post?.post)

  const [query, setQuery] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageLoaded, setImageLoaded] = useState(true)
  const [editImg, setEditImg] = useState(false)
  const [crop, setCrop] = useState({ aspect: 1 })
  const [croppedImage, setCroppedImage] = useState(null)
  const [completedCrop, setCompletedCrop] = useState(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (access_token && post_id) {

      dispatch(PostAction(access_token, post_id))
    }
  }, [access_token, post_id])

  useEffect(() => {
    if (post) {
      setQuery(post.hashtags || '')
      setDescription(post.caption || '')
      setPreviewUrl(post.media || '')
    }
  }, [post])

  console.log("Preview_Url:", previewUrl)

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ Validate before setting preview or triggering spinner
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      // Only allow matching media type as per original post
      if (post?.media_type === 'image' && !isImage) {
        alert('Please upload a valid image file.');
        return;
      }

      if (post?.media_type === 'video' && !isVideo) {
        alert('Please upload a valid video file.');
        return;
      }

      setSelectedFile(file);
      setImageLoaded(false);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);

      // ✅ Set initial crop area (shaded region will now show)
      setEditImg(isImage);
      if (isImage) {
        setCrop({
          unit: '%',
          x: 10,
          y: 10,
          width: 80,
          height: 50,
        });
      }
    }
    };

  const getCroppedImage = async () => {
  if (!imageRef.current || !completedCrop?.width || !completedCrop?.height) return null;

  const image = imageRef.current;
  const canvas = document.createElement('canvas');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropX = completedCrop.x * scaleX;
  const cropY = completedCrop.y * scaleY;
  const cropWidth = completedCrop.width * scaleX;
  const cropHeight = completedCrop.height * scaleY;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      setCroppedImage(blob);
      resolve(blob);
    }, 'image/jpeg');
  });
};

    const [Edited, setEdited] = useState(false)

    const FormHandler = async (e) => {
      e.preventDefault()

      // ✅ Validate correctly
      const queryString = Array.isArray(query) ? query.join(',') : String(query).trim();

      // if (!queryString || !description.trim()) return;

      const formData = new FormData()
      formData.append('post_id', post_id);
      formData.append('query', queryString)
      formData.append('description', description)
      if (post?.media_type === 'image') {
        if (selectedFile) {
          // If a new file is selected, validate it's an image
          if (!selectedFile.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
          }

          const cropped = await getCroppedImage();
          if (cropped) {
            formData.append('media', cropped);
          }
        }
        // Else: user only updated hashtags/description → skip media
      }

      // ✅ If it's a video post, enforce video upload and attach directly
      if (post?.media_type === 'video') {
        if (selectedFile) {
          if (!selectedFile || !selectedFile.type.startsWith('video/')) {
            alert('Please upload a valid video file.');
            return;
          }
          formData.append('media', selectedFile);
        }
      }

      // 🔄 Dispatch your edit action here
      dispatch(PostEditAction(access_token, formData))
      setEdited(true)
      console.log("Edited post data ready to send.")

    }

    const {error,loading,payload} = useSelector((state) => state.Editpost)
    console.log("Edited:++++++++=", payload)

    return (
      <Container className=' min-vh-100 mt-5'>
       <Row className='d-flex justify-content-center align-items-center '>
        <Col xs={12} md={6} className='d-flex justify-content-center align-items-center'>
                    {
            !Edited && (
                <Card style={{ overflow: 'hidden', borderRadius: '16px',minWidth: '250px' }}>

                  {previewUrl && !editImg && (
                    post?.media_type === 'video' ? (
                      <video
                        src={previewUrl}
                        controls
                        className='w-100 h-100 rounded'
                        onLoadedData={() => setImageLoaded(true)}
                        style={{ maxHeight: '400px' }}
                      />
                    ) : (
                      <Card.Img
                        src={previewUrl}
                        alt='post-img'
                        className={`w-100 h-100 ${imageLoaded ? '' : 'd-none'}`}
                        onLoad={() => setImageLoaded(true)}
                      />
                    )
                  )}


                  {!imageLoaded && (
                    <div className='d-flex justify-content-center align-items-center w-100 h-100 m-3'>
                      <Spinner animation='border' variant='dark' />
                    </div>
                  )}

                  {editImg && previewUrl && (
                    <div className='mb-4 react-crop-container'>
                      <ReactCrop
                        src={previewUrl}
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        onImageLoaded={(img) => {
                          imageRef.current = img
                          setImageLoaded(true)
                        }}
                        className="react-crop-container"
                        style={{ maxWidth: '100%' }}
                        imageStyle={{
                          maxWidth: '100%',
                          maxHeight: '500px', // adjust based on UI
                          objectFit: 'contain', // 🔑 This ensures full image is visible
                        }}
                      />
                    </div>
                  )}

                  <Card.Body>
                    <Form onSubmit={FormHandler}>
                      <Form.Group className='mb-3'>
                        <Form.Label><b>Upload New File</b></Form.Label>
                        <Form.Control type='file' accept='image/*' onChange={onImageChange} />
                      </Form.Group>

                               <Form.Group className='mb-3'>
                        <Form.Label><b>Description</b></Form.Label>
                        <Form.Control
                          as='textarea'
                          placeholder='description'
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className='mb-3'>
                        <Form.Label><b>Hash Tags</b></Form.Label>
                        <Form.Control
                          type='text'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder='#tags'
                        />
                        <Form.Text muted>
                          Enter hashtags separated by commas, e.g., <code>AI, React</code>
                        </Form.Text>
                      </Form.Group>

                      <Button
                        type='submit'
                        className='rounded btn-sm'
                        style={{ width: '100px' }}
                        disabled={selectedFile?.type?.startsWith('image') && !imageLoaded}
                      >
                        Save
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                ) 
          }

          
            {
                loading &&
                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                </div>
            }

           {payload && (  
            <div className="text-center">
                    <p className='text-success'>Post updated successfully...!</p>

                        <Link className='btn btn-primary btn-sm' to={`/profile/${username}`} onClick={()=>setupdate(false)}>Go Back</Link>
            </div>
           )}
            
            {error && (  
            <div className="text-center">
                    <p className='text-danger'>{error}</p>

                        <Link className='btn btn-primary btn-sm' to={`/profile/${username}`} onClick={()=>setupdate(false)}>Go Back</Link>
            </div>
           )}
        </Col>
       </Row>
        
      </Container>
    )
  }

  export default Editpostscreen
