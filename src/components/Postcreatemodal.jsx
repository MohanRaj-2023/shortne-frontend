import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Modal, Form, Button, InputGroup, Image } from 'react-bootstrap';
import { usePostModal } from './PoastmodalContext';
import '../App.css'
import { useDispatch, useSelector } from 'react-redux';
import { HashtagSearchAction } from '../Actions/HashtagsSearchActions';
import { PostCreateAction } from '../Actions/PostCreateActions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Lottie from 'lottie-react'
import Pipeloader from '../assets/animations/pipeloader.json'


const Postcreatemodal = () => {
  const { showPostModal, closePostModal } = usePostModal()

  const [Preview, setPreview] = useState(null)
  // const [File, setFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  // const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 }); // 1:1 Instagram-style
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    aspect: 1,
  });


  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);

  const FilechangeHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setImageLoaded(false);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("✅ FileReader result:", reader.result);
        setPreview(reader.result); // ✅ base64 string
      };
      reader.onerror = (err) => {
        console.error("❌ FileReader failed", err);
      };
      reader.readAsDataURL(file);
    } else {
      // For videos or non-image files
      setPreview(URL.createObjectURL(file));
      console.log("📹 Non-image file blob URL:", blobURL);
      setPreview(blobURL);
    }
    setCrop({
      unit: '%',
      x: 10,
      y: 10,
      height: 50,
      width: 80,
    });

  };

  // console.log("File:", File)



  const getCroppedImg = () => {
    return new Promise((resolve) => {
      const image = imgRef.current;
      const crop = completedCrop;

      if (!image || !crop?.width || !crop?.height) {
        resolve(null);
        return;
      }

      const outputSize = 500;
      
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob((blob) => {
        // const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        const file = new window.File([blob], 'cropped.jpg', { type: 'image/jpeg' });

        setCroppedImage(URL.createObjectURL(blob));
        resolve(file);
      }, 'image/jpeg');
    });
  };

  console.log("File is:", File);

  const [query, Setquery] = useState('')
  const [description, Setdiscription] = useState('')

  const dispatch = useDispatch()

  const PostCreate = useSelector((state) => state.PostCreate)
  const { loading, error, payload } = PostCreate
  const [postcreated, Setpostcreated] = useState(false)

  const [imageLoaded, setImageLoaded] = useState(false);


  // form handler
  const FormHandler = async () => {
    if (selectedFile !== null) {
      console.log("imgRef before cropping:", imgRef.current);

      if (selectedFile.type.startsWith('image') && !imgRef.current) {
        console.error("The image has not loaded yet!");
        return; // Prevent trying to crop before the image is ready.
      }

      const userinfo = JSON.parse(localStorage.getItem('userinfo'))
      const access_token = userinfo?.access
      const finalImage = selectedFile.type.startsWith('image') ? await getCroppedImg() : selectedFile;

      if (!finalImage) {
        alert("Image failed to crop.");
        return;
      }

      // ✅ Construct formData with description, query, and media
      const formData = new FormData();
      formData.append('description', description);
      formData.append('query', query); // 🔄 replace hashtagsids
      formData.append('media', finalImage);

      console.log("media:", finalImage)
      console.log("Seletced File:", selectedFile)
      console.log("typeof finalImage:", typeof finalImage);
      console.log("finalImage instanceof File:", finalImage instanceof File);
      console.log("finalImage.name:", finalImage.name);

      
      const file = formData.get('media');

      if (file) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage && file.size > 5 * 1024 * 1024) {
          alert("Image must be less than 5MB.");
          return;
        }

        if (isVideo && file.size > 9 * 1024 * 1024) {
          alert("Video must be less than 9MB.");
          return;
        }
      }


      dispatch(PostCreateAction(access_token, formData))

      setPreview(false)
      setSelectedFile(null)
      // Sethashtagids('')
      Setquery('')
      Setdiscription('');
      setCroppedImage(null);
      setImageLoaded(false);
    }

  }

  // // Postcreated
  const [postfail, setPostfail] = useState(false)
  useEffect(() => {
    if (payload) {
      Setpostcreated(true)
    }
    else if (error) {
      setPostfail(true)
    }
  }, [payload, error])

  console.log("Payload:==========", payload)
  console.log("Post_create_error:==========", error)

  const Cancelhandler = (e) => {
    setPreview(null);
    setSelectedFile(null);
    setCroppedImage(null);
    Setquery('');
    Setdiscription('');
    setCompletedCrop(null);
    setImageLoaded(false);
    Setpostcreated(false);
    setPostfail(false)
  }
  console.log("Preview:", Preview)

  useEffect(() => {
    if (!showPostModal) {
      setPreview(null);
      setSelectedFile(null);
      setCroppedImage(null);
      Setquery('');
      Setdiscription('');
      setCompletedCrop(null);
      setImageLoaded(false);
      Setpostcreated(false);
      setPostfail(false)
    }
  }, [showPostModal]);





  return (
    <>

      <Modal size='lg' show={showPostModal} onHide={closePostModal} centered>
        <Modal.Header closeButton onClick={() => Setpostcreated(false)}>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {/* Poasting Form */}
          <Form>
            {!Preview ? (
              <>
                <Form.Group className='mb-3'>
                  <Form.Label style={{ fontWeight: 'bold' }}>Choose File</Form.Label>

                  <Form.Control
                    type='file'
                    accept='image/*,video/*'
                    onChange={FilechangeHandler}
                    required
                  />

                </Form.Group>

              </>
            ) :
              (
                <>
                  {selectedFile?.type?.startsWith('image') && typeof Preview === 'string' ? (

                    <div className="mb-4 react-crop-container">
                      <ReactCrop
                        key={Preview}
                        crop={crop}
                        onChange={setCrop}
                        onComplete={setCompletedCrop}
                        onImageLoaded={(img) => {
                          console.log("Image:", img)
                          console.log("✅ onImageLoaded triggered");
                          imgRef.current = img; // ✅ This is mandatory
                          setImageLoaded(true);
                          return false; // ✅ Optional: prevents default behavior
                        }}

                        style={{ maxWidth: '100%' }}
                        imageStyle={{
                          maxWidth: '100%',
                          maxHeight: '500px', // adjust based on UI
                          objectFit: 'contain', // 🔑 This ensures full image is visible
                        }}
                        className="react-crop-container"
                        src={Preview}
                      />



                      {!imageLoaded && (
                        <p className="text-danger">Image is loading or failed to load</p>
                      )}
                    </div>


                  ) : (
                    <div className='media-crop-container mb-4'>
                      <video src={Preview} alt='Preview_video' controls className='w-100 rounded cropped-media' />
                    </div>

                  )}


                  <Form.Group className='mb-3'>
                    <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                    <Form.Control as='textarea' type='text' placeholder='description' value={description} onChange={(e) => Setdiscription(e.target.value)} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label style={{ fontWeight: 'bold' }}>Hash Tags</Form.Label>
                    <Form.Control
                      type='text'
                      value={query}
                      onChange={(e) => Setquery(e.target.value)}
                      placeholder='#AI, #Python, #YourNewTag'
                    />
                    <Form.Text muted>
                      Enter hashtags separated by commas, e.g., <code>#AI, #React</code>
                    </Form.Text>
                  </Form.Group>


                </>
              )}

          </Form>

          {
            postcreated ? (
              <p className='text-success text-center'>{payload}</p>
            ) : postfail ? (
              <p className='text-danger text-center'>{error}</p>
            ) : (
              ''
            )
          }

          {
            loading && (
              <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                <Lottie animationData={Pipeloader} loop={true} style={{ width: 250 }} />
              </div>
            )
          }


        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-sm-end justify-content-center'>
          <Button type='button' variant='secondary' className='rounded btn-sm' style={{ width: '100px' }} onClick={Cancelhandler} disabled={!selectedFile} >Cancel</Button>
          <Button type='submit'
            className='rounded btn-sm'
            style={{ width: '100px' }}
            onClick={FormHandler}
            disabled={!selectedFile || (selectedFile?.type?.startsWith('image') && !imageLoaded)}
          >Post</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Postcreatemodal