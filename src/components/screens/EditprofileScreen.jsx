import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Image, Form } from 'react-bootstrap'
import { ProfileAction } from '../../Actions/UserprofileActions'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { ProfileEditAction } from '../../Actions/UserprofileActions';
import Lottie from 'lottie-react'
import FormLoader from '../../assets/animations/formloader.json'
import { PROFILE_EDIT_RESET } from '../../Constants/UserprofileConstants';

// image croper
import { getCroppedImg } from '../../utils/cropimage';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EditprofileScreen = () => {
    const userinfo = useSelector((state) => state.UserSigninReducer?.userinfo)
    const dispatch = useDispatch()
    const username = userinfo?.username
    const access_token = userinfo?.access

    useEffect(() => {
        dispatch({type:PROFILE_EDIT_RESET})
        dispatch(ProfileAction(access_token, username))
    }, [access_token, username])

    const userprofileinfo = useSelector((state) => state.Profileinfo?.profileinfo)
    // console.log("Edit_info:",userprofileinfo)

    // const [image, setImage] = useState(null)
    const [bio, setBio] = useState('')
    const [externalLink, setExternalLink] = useState('')
    const [previewImage, setPreviewImage] = useState('')

    useEffect(() => {
        if (userprofileinfo) {
            setBio(userprofileinfo?.bio || '')
            setExternalLink(userprofileinfo?.link || '')
            setPreviewImage(`${userprofileinfo?.image}`)
        }
    }, [userprofileinfo])

    // image crop
    const [crop, setCrop] = useState({ unit: '%', width: 60, aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageLoaded = (img) => {
        setImgRef(img);
    };

    useEffect(() => {
        if (!completedCrop || !imgRef) return;

        (async () => {
            const blob = await getCroppedImg(imgRef, completedCrop);
            setCroppedBlob(blob);
            setPreviewImage(URL.createObjectURL(blob)); // Optional preview
        })();
    }, [completedCrop, imgRef]);

    const [updated,setUpdated]=useState(false)
    const [update,setupdate] = useState(false)

    const formhandler = (e) => {
        e.preventDefault()
        const formData = new FormData()

        formData.append('bio', bio)
        formData.append('link', externalLink)
        if (croppedBlob) {
            formData.append('image', croppedBlob, 'profile.jpg');
        }

        dispatch(ProfileEditAction(access_token, formData))
        setupdate(true)
    }

    const {loading,error,profileinfo }= useSelector((state) => state.Editprofile)
    console.log("Profile_info:(updated)",profileinfo)
    
    
    console.log('updated_status:',updated)

    return (
        <Container className='mt-5 justify-content-center d-flex'>
           {
            !update &&(
                    <Form className="p-4 border rounded" style={{ maxWidth: '500px', width: '100%' }} onSubmit={formhandler}>
                <div className="mb-4 text-center position-relative">
                    {imageUrl ? (
                        <>
                            <ReactCrop
                                src={imageUrl}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop={true}
                                onImageLoaded={onImageLoaded}
                            />
                        </>
                    ) : (
                        <Image
                            src={previewImage}
                            className="rounded-circle mb-2"
                            width="100"
                            height="100"
                            style={{ objectFit: 'cover' }}
                        />
                    )}


                    {/* Pencil icon as file input */}
                    <Form.Label
                        htmlFor="profileImageInput"
                        className="position-absolute"
                        style={{
                            bottom: 0,
                            right: '35%',
                            background: '#ffffff',
                            borderRadius: '50%',
                            padding: '5px',
                            cursor: 'pointer',
                            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                            transform: 'translate(25%, 25%)',
                        }}
                    >
                        <i className='fa-solid fa-user-pen' size={14}></i>
                    </Form.Label>

                    <Form.Control
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} />
                </div>
                {/* Username */}
                <div className="mt-2 fw-bold text-center">{username}</div>

                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us something about yourself..."
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>External Link</Form.Label>
                    <Form.Control
                        type="text"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://yourwebsite.com"
                    />
                </Form.Group>

                <div className="text-center">
                    <Button type="submit" variant="warning">Save Changes</Button>
                </div>
            </Form>
            )
            
           }

            {
                loading &&
                <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ marginTop: "10px" }}>
                  <Lottie animationData={FormLoader} loop={true} style={{ width: 50 }} />
                </div>
            }

           {profileinfo && (  
            <div className="text-center">
                    <p className='text-success'>Profile updated successfully...!</p>

                        <Link className='btn btn-primary btn-sm' to={`/profile/${username}`} onClick={()=>setupdate(false)}>Go Back</Link>
            </div>
           )}
            
            {error && (  
            <div className="text-center">
                    <p className='text-danger'>{error}</p>

                        <Link className='btn btn-primary btn-sm' to={`/profile/${username}`} onClick={()=>setupdate(false)}>Go Back</Link>
            </div>
           )}


        </Container>
    )
}

export default EditprofileScreen