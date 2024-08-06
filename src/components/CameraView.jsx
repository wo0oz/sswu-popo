// CameraView.js

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
        width: { ideal: 640 }, // Ideal width for portrait (4:3)
        height: { ideal: 853 }, // Ideal height for portrait (4:3)
      },
    })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  }, []);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');

    // Flip the image horizontally for a mirrored effect
    context.save();
    context.scale(-1, 1);
    context.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    navigate('/check');
  };

  return (
    <div className="container camera-view">
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline />
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
