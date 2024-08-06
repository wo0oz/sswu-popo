import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CameraView.scss';

function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useContext(CaptureContext);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleVideoPlay = () => {
      videoElement.play().catch(err => {
        console.error("Error attempting to play video: ", err);
      });
    };
  
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 480 },
        height: { ideal: 640 }
      }
    };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        videoElement.srcObject = stream;
        videoElement.addEventListener('loadedmetadata', handleVideoPlay);
      })
      .catch(err => {
        console.error('Failed to get media stream', err);
      });
  
    // Cleanup function to remove event listener
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleVideoPlay);
    };
  }, []);
  

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    // Set canvas size to match video stream's resolution
    canvas.width = 480; // Fixed width for portrait
    canvas.height = 640; // Fixed height for portrait

    const context = canvas.getContext('2d');
    // Optionally flip the canvas context horizontally
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    // Draw the video frame to canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    navigate('/check');
  };

  return (
    <div className="container camera-view">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)' }} />
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
