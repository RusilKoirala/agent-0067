import React, { useEffect, useRef } from 'react';
import { parsePoseControls } from '../game/gestures';

export default function VideoOverlay({
  videoRef,
  landmarkerRef,
  playerXRef,
  playerDepthRef,
  triggerShootRef,
}) {

    // basic refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const headCenterXRef = useRef(null);
  const headCenterZRef = useRef(null);
  const currentStateRef = useRef('NEUTRAL');

  useEffect(() => {
    const processFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (video && canvas && landmarker && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const results = await landmarker.detectForVideo(video, performance.now());

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];

          const { headTilt, headDepth, bothHandsActive, shouldShoot } = parsePoseControls(
            landmarks,
            { headCenterXRef, headCenterZRef, playerXRef, playerDepthRef, currentStateRef }
          );

          if (shouldShoot) {
            triggerShootRef.current();
          }

          // Visual Debug Overlay
          const w = canvas.width;
          const h = canvas.height;
          const nose = landmarks[0];
          const leftWrist = landmarks[15];
          const rightWrist = landmarks[16];

          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(nose.x * w, nose.y * h, 6, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#00ffff';
          ctx.beginPath();
          ctx.arc(leftWrist.x * w, leftWrist.y * h, 6, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#ff00ff';
          ctx.beginPath();
          ctx.arc(rightWrist.x * w, rightWrist.y * h, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="video-pip">
      <video ref={videoRef} playsInline muted />
      <canvas ref={canvasRef} width={320} height={240} />
    </div>
  );
}