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
      navigate('/camera'); // Navigate to camera view if no image is captured
      return;
    }

    const loadImages = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const frameImage = new Image();
      const capturedImg = new Image();

      frameImage.src = '/images/polaroid.png'; // Load the frame image
      capturedImg.src = capturedImage; // Load the captured image

      const loadImage = (img) => {
        return new Promise((resolve, reject) => {
          img.onload = resolve; // Resolve the promise when the image loads
          img.onerror = reject; // Reject the promise on error
        });
      };

      try {
        await Promise.all([loadImage(frameImage), loadImage(capturedImg)]); // Wait for images to load

        const frameWidth = frameImage.width;
        const frameHeight = frameImage.height;

        // Adjust image dimensions based on screen size
        let imageWidth, imageHeight, imageX, imageY;
        if (window.innerWidth <= 768) {
          imageWidth = frameWidth * 0.8; 
          imageHeight = frameHeight * 0.8;
        } else {
          imageWidth = frameWidth * 0.8; 
          imageHeight = frameHeight * 0.77;
        }
        imageX = (frameWidth - imageWidth) / 2.3;
        imageY = (frameHeight - imageHeight) / 2.5;

        canvas.width = frameWidth; // Set canvas width
        canvas.height = frameHeight; // Set canvas height

        context.clearRect(0, 0, frameWidth, frameHeight); // Clear the canvas

        context.save(); // Save the canvas state
        context.translate(canvas.width, 0); 
        context.scale(-1, 1); // Flip the image horizontally

        context.drawImage(capturedImg, imageX, imageY, imageWidth, imageHeight); // Draw captured image
        context.restore(); // Restore the canvas state

        context.drawImage(frameImage, 0, 0, frameWidth, frameHeight); // Draw frame image

        const finalImage = canvas.toDataURL('image/png'); // Convert canvas to data URL
        setCapturedImage((prevImage) => (prevImage === capturedImage ? finalImage : prevImage)); // Update captured image
        setImageLoaded(true); // Set image loaded to true
      } catch (error) {
        console.error('Failed to load images', error); // Log error
      }
    };

    loadImages(); // Call loadImages function

  }, [capturedImage, navigate, setCapturedImage]); // Add missing dependencies

  const handleRetake = () => {
    setCapturedImage(null); // Reset captured image
    setImageLoaded(false); // Reset image loaded state
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  };

  return (
    <div className="check-view">
      <div className="photo-frame">
        <canvas ref={canvasRef} className="result-canvas"></canvas>
        {!imageLoaded && (
          <div>
            <Loading />
          </div>
        )}
      </div>
      <div className="button-container">
        <Link to="/camera" onClick={handleRetake}>
          <button className="retake-button">
            <img src="images/BackButton.png" alt="Back" />
            Again
          </button>
        </Link>
        <Link to="/decorate">
          <button className="next-button">
            <img src="images/NextButton.png" alt="Next" />
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
