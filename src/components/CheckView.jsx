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

  const FRAME_WIDTH = 800;  // 카메라와 동일한 프레임 너비
  const FRAME_HEIGHT = 1000;  // 카메라와 동일한 프레임 높이

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

        canvas.width = FRAME_WIDTH;
        canvas.height = FRAME_HEIGHT;

        context.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);

        // 블랙 배경으로 캔버스 초기화
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 캡처된 이미지 그리기 (좌우 반전 포함)
        context.save();
        context.scale(-1, 1);
        context.drawImage(capturedImg, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        // 프레임 이미지 그리기
        context.drawImage(frameImage, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);

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
        <canvas ref={canvasRef} className="result-canvas" width={FRAME_WIDTH} height={FRAME_HEIGHT}></canvas>
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
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CheckView;
