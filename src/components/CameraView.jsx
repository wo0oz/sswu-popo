import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CameraView.scss';

function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useContext(CaptureContext);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 480 },  // Set this to your desired width
        height: { ideal: 640 }  // Set this to your desired height
      }
    })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  }, []);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Use the actual video dimensions for canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    // Mirror the image
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    navigate('/check');
  };

  return (
    <div className="container camera-view">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline width="480" height="640" />
      </div>
      <div className="camera-button">
        <button className="capture-button" onClick={captureImage}>
          <img src='images/CameraButton.png' alt='Capture' />
        </button>
      </div>
    </div>
  );
}

export default CameraView;
