import React, { useEffect, useRef } from 'react';
import { parsePoseControls } from '../game/gestures';

export default function VideoOverlay({
  videoRef,
  landmarkerRef,
  playerXRef,
  triggerShootRef,
}) {

  // basic refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const headCenterXRef = useRef(null);
  const currentStateRef = useRef('NEUTRAL');

  useEffect(() => {
    console.log('🎬 VideoOverlay mounted, starting processFrame loop');
    
    const processFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (!video) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }
      
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }
      
      if (!landmarker) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Check if video has actual data (width/height > 0)
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        
        const results = await landmarker.detectForVideo(video, performance.now());

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];

          const { headTilt, bothHandsActive, shouldShoot } = parsePoseControls(
            landmarks,
            { headCenterXRef, playerXRef, currentStateRef }
          );

          if (shouldShoot) {
            console.log('🔫 SHOOT triggered!');
            triggerShootRef.current();
          }

          // Visual Debug Overlay
          const w = canvas.width;
          const h = canvas.height;
          const nose = landmarks[0];
          const leftWrist = landmarks[15];
          const rightWrist = landmarks[16];

          // Draw landmarks
          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(nose.x * w, nose.y * h, 8, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#00ffff';
          ctx.beginPath();
          ctx.arc(leftWrist.x * w, leftWrist.y * h, 8, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#ff00ff';
          ctx.beginPath();
          ctx.arc(rightWrist.x * w, rightWrist.y * h, 8, 0, 2 * Math.PI);
          ctx.fill();

          // Draw status text
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px monospace';
          
          if (bothHandsActive) {
            ctx.fillStyle = '#ffff00';
            ctx.fillText('HANDS UP: ' + currentStateRef.current, 10, 30);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      console.log('🛑 VideoOverlay unmounting, stopping processFrame loop');
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [videoRef, landmarkerRef, playerXRef, triggerShootRef]);

  return (
    <div className="video-pip">
      <video ref={videoRef} playsInline muted />
      <canvas ref={canvasRef} width={320} height={240} />
    </div>
  );
}