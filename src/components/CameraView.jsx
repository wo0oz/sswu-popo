import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CameraView.scss';

function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { setCapturedImage } = useContext(CaptureContext);

  useEffect(() => {
    if (!capturedImage) {
      navigate('/camera');
      return;
    }
  
    const loadImages = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const frameImage = new Image();
      const capturedImg = new Image();
  
      frameImage.src = '/images/polaroid.png';
      capturedImg.src = capturedImage;
  
      const loadImage = (img) => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      };
  
      try {
        await Promise.all([loadImage(frameImage), loadImage(capturedImg)]);
  
        const frameWidth = frameImage.width;
        const frameHeight = frameImage.height;
  
        let imageWidth, imageHeight, imageX, imageY;
        if (window.innerWidth <= 768) { // Adjust for mobile
          canvas.width = frameWidth * 0.8;
          canvas.height = frameHeight * 1.3; // Extend height for portrait
          imageWidth = canvas.width;
          imageHeight = canvas.height * 0.85; // Proportion of the image to fit in the extended frame
          imageX = (canvas.width - imageWidth) / 2;
          imageY = (canvas.height - imageHeight) / 10; // Minimal offset for vertical centering
        } else {
          canvas.width = frameWidth;
          canvas.height = frameHeight;
          imageWidth = frameWidth * 0.8; 
          imageHeight = frameHeight * 0.77;
          imageX = (frameWidth - imageWidth) / 2.3;
          imageY = (frameHeight - imageHeight) / 2.5;
        }
  
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1); // Flip the image horizontally if necessary
  
        context.drawImage(capturedImg, imageX, imageY, imageWidth, imageHeight);
        context.restore();
  
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  
        const finalImage = canvas.toDataURL('image/png');
        setCapturedImage((prevImage) => prevImage === capturedImage ? finalImage : prevImage);
        setImageLoaded(true);
      } catch (error) {
        console.error('Failed to load images', error);
      }
    };
  
    loadImages();
  }, []);
  
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

export default CameraView; //카메라 컴포넌트를 추출한다는 뜻 (맹)
