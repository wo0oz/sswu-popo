// CheckView.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptureContext from '../contexts/CaptureContext';
import '../asset/CheckView.scss';
import Loading from './Loading';

function CheckView() {
  const { capturedImage, setCapturedImage } = useContext(CaptureContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

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

        // Calculate image dimensions based on the frame aspect ratio
        const imageAspectRatio = capturedImg.width / capturedImg.height;
        const frameAspectRatio = frameWidth / frameHeight;

        let imageWidth, imageHeight, imageX, imageY;

        if (imageAspectRatio > frameAspectRatio) {
          // Image is wider than frame, fit to frame height
          imageHeight = frameHeight;
          imageWidth = imageHeight * imageAspectRatio;
          imageX = (frameWidth - imageWidth) / 2;
          imageY = 0;
        } else {
          // Image is taller than frame, fit to frame width
          imageWidth = frameWidth;
          imageHeight = imageWidth / imageAspectRatio;
          imageX = 0;
          imageY = (frameHeight - imageHeight) / 2;
        }

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        context.clearRect(0, 0, frameWidth, frameHeight);

        // Initialize the canvas with a black background
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        // Draw the captured image on the canvas
        context.drawImage(capturedImg, imageX, imageY, imageWidth, imageHeight);
        context.restore();

        // Draw the frame image on top
        context.drawImage(frameImage, 0, 0, frameWidth, frameHeight);

        const finalImage = canvas.toDataURL('image/png');
        setCapturedImage((prevImage) => (prevImage === capturedImage ? finalImage : prevImage));
        setImageLoaded(true);
      } catch (error) {
        console.error('Failed to load images', error);
      }
    };

    loadImages();
  }, [capturedImage, navigate, setCapturedImage]);

  const handleRetake = () => {
    setCapturedImage(null);
    setImageLoaded(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="check-view">
      <div className="photo-frame">
        <canvas ref={canvasRef} className="result-canvas"></canvas>
        {!imageLoaded && <div><Loading /></div>}
      </div>
      <div className="button-container">
        <Link to="/camera" onClick={handleRetake}>
          <button className="retake-button">
            <img src='images/BackButton.png' alt='Back' />
            Again
          </button>
        </Link>
        <Link to="/decorate">
          <button className="next-button">
            <img src='images/NextButton.png' alt='Next' />
            Next</button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
